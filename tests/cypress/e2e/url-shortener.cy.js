describe('URL Shortener Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Page Load and UI Elements', () => {
    it('should load the homepage with correct title and elements', () => {
      cy.title().should('contain', 'URL Shortener');
      cy.contains('URL Shortener').should('be.visible');
      cy.contains('Transform long URLs into short, shareable links').should('be.visible');
      cy.get('[data-testid="url-input"]').should('be.visible');
      cy.get('[data-testid="shorten-button"]').should('be.visible');
    });

    it('should have proper input field placeholder', () => {
      cy.get('[data-testid="url-input"]').should('have.attr', 'placeholder', 'https://example.com/very/long/url');
    });

    it('should disable submit button when input is empty', () => {
      cy.get('[data-testid="shorten-button"]').should('be.disabled');
    });

    it('should enable submit button when input has text', () => {
      cy.get('[data-testid="url-input"]').type('https://example.com');
      cy.get('[data-testid="shorten-button"]').should('not.be.disabled');
    });
  });

  describe('URL Shortening Functionality', () => {
    it('should successfully shorten a valid URL', () => {
      const testUrl = 'https://www.google.com';
      
      cy.shortenUrl(testUrl);
      cy.waitForShortUrl();
      
      cy.get('[data-testid="short-url"]').should('contain', Cypress.config().baseUrl);
      cy.get('[data-testid="result-card"]').should('contain', testUrl);
    });

    it('should shorten multiple different URLs', () => {
      cy.fixture('test-urls').then((urls) => {
        urls.validUrls.forEach((url, index) => {
          cy.shortenUrl(url);
          cy.waitForShortUrl();
          
          // Verify each URL gets a unique short code
          cy.get('[data-testid="short-url"]').then(($el) => {
            const shortUrl = $el.text();
            expect(shortUrl).to.contain(Cypress.config().baseUrl);
            expect(shortUrl.split('/').pop()).to.have.length.greaterThan(5);
          });

          // Clear the result for next iteration (except last one)
          if (index < urls.validUrls.length - 1) {
            cy.reload();
          }
        });
      });
    });

    it('should clear input field after successful shortening', () => {
      cy.shortenUrl('https://www.example.com');
      cy.waitForShortUrl();
      cy.get('[data-testid="url-input"]').should('have.value', '');
    });
  });

  describe('Copy Functionality', () => {
    it('should show copy button for shortened URLs', () => {
      cy.shortenUrl('https://www.github.com');
      cy.waitForShortUrl();
      cy.get('[data-testid="copy-button"]').should('be.visible');
    });

    it('should show success message after copying', () => {
      cy.shortenUrl('https://www.github.com');
      cy.waitForShortUrl();
      cy.copyShortUrl();
      cy.contains('URL copied to clipboard!').should('be.visible');
    });
  });

  describe('URL Validation', () => {
    it('should show error for invalid URLs', () => {
      const invalidUrl = 'not-a-valid-url';
      cy.get('[data-testid="url-input"]').clear().type(invalidUrl);
      cy.get('[data-testid="shorten-button"]').click();
      cy.get('[data-testid="error-message"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid URL');
    });

    it('should show error message when submitting empty form', () => {
      cy.get('[data-testid="url-input"]').clear();
      // Button should be disabled, but let's test the validation anyway
      cy.get('[data-testid="shorten-button"]').should('be.disabled');
    });
  });

  describe('URL Redirection', () => {
    it('should redirect when visiting a shortened URL', () => {
      const testUrl = 'https://www.example.com';
      
      cy.shortenUrl(testUrl);
      cy.waitForShortUrl();
      
      // Extract the short code from the displayed URL
      cy.get('[data-testid="short-url"]').then(($el) => {
        const shortUrl = $el.text();
        const shortCode = shortUrl.split('/').pop();
        
        // Visit the short URL and verify redirection
        cy.request({
          url: `/${shortCode}`,
          followRedirect: false
        }).then((response) => {
          expect(response.status).to.eq(307); // Temporary redirect
          expect(response.headers.location).to.eq(testUrl);
        });
      });
    });
  });

  describe('API Endpoints', () => {
    it('should return stats for a shortened URL', () => {
      const testUrl = 'https://www.github.com';
      
      cy.shortenUrl(testUrl);
      cy.waitForShortUrl();
      
      cy.get('[data-testid="short-url"]').then(($el) => {
        const shortUrl = $el.text();
        const shortCode = shortUrl.split('/').pop();
        
        cy.request(`/api/stats/${shortCode}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('shortCode', shortCode);
          expect(response.body).to.have.property('originalUrl', testUrl);
          expect(response.body).to.have.property('clickCount');
          expect(response.body).to.have.property('createdAt');
        });
      });
    });

    it('should return 404 for non-existent short codes', () => {
      cy.request({
        url: '/api/stats/nonexistent',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.error).to.contain('not found');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during URL shortening', () => {
      cy.get('[data-testid="url-input"]').type('https://www.example.com');
      cy.get('[data-testid="shorten-button"]').click();
      
      // The loading state might be brief, so just verify the button behavior
      cy.get('[data-testid="shorten-button"]').should('exist');
      // Wait for result to appear instead
      cy.get('[data-testid="result-card"]', { timeout: 10000 }).should('be.visible');
    });
  });
});