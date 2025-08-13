# URL Shortener - Okteto Preview Environments Demo

A complete URL shortener application demonstrating **Okteto Preview Environments** and **automated testing** in the pull request workflow. This repository showcases how to build, test, and deploy cloud-native applications using Okteto's developer platform.

## 🎯 **What This Demo Teaches**

This repository demonstrates how to:

- ✅ **Deploy Preview Environments** automatically for each pull request
- ✅ **Run End-to-End Tests** in Okteto using `okteto test`
- ✅ **Validate Changes** before merging using automated testing
- ✅ **Clean Up Resources** automatically when pull requests are closed
- ✅ **Develop Cloud-Native Apps** remotely using Okteto's platform
- ✅ **Remote Development** with zero local setup or dependencies

## 🏗️ **Application Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend API   │────│   PostgreSQL    │
│   (Next.js)     │    │   (Next.js)     │    │   Database      │
│   - Material-UI │    │   - URL Shortening │ │   - URL Storage  │
│   - Responsive  │    │   - Analytics    │    │   - Click Tracking │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Features**
- 🔗 **URL Shortening**: Convert long URLs into short, shareable links
- 📊 **Click Analytics**: Track click counts and creation dates
- 📱 **Responsive UI**: Clean Material-UI design that works on all devices
- 🔒 **Input Validation**: Comprehensive URL validation and error handling
- 📋 **Copy to Clipboard**: One-click copying of shortened URLs
- 🚀 **Fast Redirects**: Efficient URL redirection with database tracking

## 🚀 **Quick Start with Okteto**

### **Prerequisites**
- [Okteto CLI](https://okteto.com/docs/getting-started/) installed
- Access to an Okteto cluster (okteto.com or self-hosted)

### **1. Deploy the Application**

```bash
# Clone the repository
git clone <your-repo-url>
cd url-shortener

# Deploy to Okteto (builds and deploys in the cloud)
okteto deploy --wait

# Check the deployment
okteto endpoints
```

### **2. Run Tests in Okteto**

```bash
# Run end-to-end tests in Okteto containers
okteto test

# Run specific test suite
okteto test e2e
```

### **3. Access the Application**

Your application will be available at:
```
https://app-<your-namespace>.<your-okteto-domain>
```

## 🔄 **Preview Environment Workflow**

This repository demonstrates the complete **Preview Environment** workflow:

### **When you create a Pull Request:**

1. **🚀 Automatic Deployment**
   - GitHub Action triggers (`preview-deploy.yml`)
   - Okteto creates an isolated preview environment
   - Application is built and deployed using Docker Compose
   - Unique URL is generated: `https://app-pr-123-<namespace>.<domain>`

2. **🧪 Automated Testing**
   - Cypress end-to-end tests run against the preview environment
   - Tests validate all functionality:
     - URL shortening
     - Input validation
     - UI interactions
     - API endpoints
     - Database operations

3. **✅ Results Reporting**
   - Test results are reported back to the PR
   - Deployment status is visible in GitHub

### **When you close/merge a Pull Request:**

1. **🧹 Automatic Cleanup**
   - GitHub Action triggers (`preview-cleanup.yml`)
   - Preview environment is automatically destroyed
   - Resources are cleaned up to avoid waste

## 🛠️ **Technology Stack**

### **Frontend**
- **Next.js 14** - React framework with SSR/SSG
- **Material-UI (MUI)** - React component library
- **TypeScript** - Type-safe JavaScript
- **Responsive Design** - Mobile-first approach

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Robust relational database
- **Connection Pooling** - Efficient database connections
- **Input Validation** - Security-first API design

### **Testing**
- **Cypress** - End-to-end testing framework
- **15 Test Cases** covering all functionality
- **Automated Test Execution** in Okteto containers

### **DevOps & Deployment**
- **Docker & Docker Compose** - Containerization
- **Okteto** - Cloud-native development platform
- **GitHub Actions** - CI/CD automation
- **PostgreSQL** - Production-ready database

## 📁 **Project Structure**

```
url-shortener/
├── 📂 .github/workflows/       # GitHub Actions
│   ├── preview-deploy.yml      # Deploy preview environments
│   └── preview-cleanup.yml     # Clean up preview environments
├── 📂 cypress/                 # End-to-end tests
│   ├── e2e/url-shortener.cy.js # Main test suite (15 tests)
│   ├── fixtures/               # Test data
│   └── support/                # Helper commands
├── 📂 db/                      # Database configuration
│   └── init.sql                # Database schema
├── 📂 lib/                     # Utility libraries
│   └── db.ts                   # Database connection
├── 📂 pages/                   # Next.js pages and API routes
│   ├── api/                    # API endpoints
│   ├── index.tsx               # Main application page
│   └── [shortCode].tsx         # Redirect page
├── 📂 public/                  # Static assets
├── 📄 docker-compose.yml       # Application stack definition
├── 📄 Dockerfile               # Production container
├── 📄 okteto.yml               # Okteto deployment manifest
├── 📄 cypress.config.js        # Cypress configuration
└── 📄 package.json             # Dependencies and scripts
```

## 🧪 **Testing Strategy**

### **Test Coverage (15 Tests)**

1. **UI Component Testing**
   - Page load and element visibility
   - Input field behavior and validation
   - Button states and interactions

2. **Functionality Testing**
   - URL shortening with various inputs
   - Error handling for invalid URLs
   - Copy-to-clipboard functionality

3. **API Testing**
   - REST endpoint validation
   - Database integration
   - Error response handling

4. **Integration Testing**
   - End-to-end user workflows
   - URL redirection functionality
   - Analytics tracking

### **Running Tests in Okteto**

```bash
# Deploy the application to Okteto
okteto deploy --wait

# Run tests against deployed app in Okteto containers
okteto test e2e
```

## ⚙️ **Configuration Files**

### **Okteto Manifest (`okteto.yml`)**
```yaml
deploy:
  compose: docker-compose.yml

test:
  e2e:
    image: cypress/included:13.6.1
    caches:
      - /root/.cache
      - /root/.yarn
    commands:
      - yarn install --frozen-lockfile
      - yarn cypress:run --config video=false,screenshotOnRunFailure=false
```

### **GitHub Actions**

**Preview Deploy** (`.github/workflows/preview-deploy.yml`):
- Triggers on PR creation/updates
- Uses `okteto/deploy-preview` action
- Runs automated tests with `okteto/test`

**Preview Cleanup** (`.github/workflows/preview-cleanup.yml`):
- Triggers on PR closure
- Uses `okteto/destroy-preview` action
- Automatically cleans up resources

## 🔧 **Development Workflow**

### **1. Remote Development with Okteto**
```bash
# Clone and setup
git clone <repo-url>
cd url-shortener

# Deploy to Okteto (everything runs in the cloud)
okteto deploy --wait

# Check endpoints
okteto endpoints
```

### **2. Making Changes**

# Activate developer mode so your changes are automatically applied
```bash
okteto up

# Make your changes
# ... edit files ...

# Run tests in Okteto containers in a separate terminal
okteto test e2e
```

### **3. Pull Request Process**
```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Commit changes
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature

# Create PR → Automatic preview environment + tests in Okteto!
```

## 🌟 **Key Learnings**

### **Preview Environments Benefits**
- ✅ **Isolated Testing** - Each PR gets its own environment
- ✅ **Realistic Testing** - Tests run against actual deployed applications
- ✅ **Collaboration** - Share preview URLs with stakeholders
- ✅ **Risk Reduction** - Catch issues before they reach production

### **Okteto Test Integration**
- ✅ **Container-based Testing** - Tests run in consistent cloud environments
- ✅ **Parallel Execution** - Fast test execution with proper resource allocation
- ✅ **Cloud-native** - No dependencies or setup required - everything runs remotely

### **Best Practices Demonstrated**
- ✅ **Infrastructure as Code** - Everything defined in version control
- ✅ **Automated Cleanup** - No manual resource management needed
- ✅ **Security** - Environment variables and secrets properly managed
- ✅ **Observability** - Clear logging and error reporting

## 🚀 **Getting Started Guide**

### **For Your Own Project**

1. **Copy the Workflow Files**
   ```bash
   cp -r .github/workflows/ your-project/
   ```

2. **Add Okteto Manifest**
   ```bash
   cp okteto.yml your-project/
   # Modify for your application stack
   ```

3. **Set Up GitHub Repository**
   - Add `OKTETO_TOKEN` secret to repository
   - Update workflow files with your repository details

4. **Customize Tests**
   - Replace Cypress tests with your own test suite
   - Update the `test` section in `okteto.yml`

### **Repository Secrets Required**

Add these secrets to your GitHub repository:

- `OKTETO_TOKEN` - Your Okteto personal access token

## 📚 **Learn More**

- [Okteto Documentation](https://okteto.com/docs)
- [Preview Environments Guide](https://okteto.com/docs/cloud/preview-environments)
- [Testing with Okteto](https://okteto.com/docs/testing/getting-started)
- [GitHub Actions Integration](https://github.com/marketplace?query=okteto)

## 🤝 **Contributing**

This repository is designed as a learning resource. Feel free to:

1. Fork the repository
2. Try the workflow with your own changes
3. Submit issues for improvements
4. Share your experience with preview environments

## 📝 **License**

This project is open source and available under the [MIT License](LICENSE).

---

**🎯 Ready to try Preview Environments?**

1. Fork this repository
2. Set up your Okteto account
3. Add the required secrets
4. Create a pull request and watch the magic happen!

**Questions?** Open an issue or reach out to the Okteto community.
