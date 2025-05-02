# T-DEV-700_Trinity


## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.


# Project Technologies and Architecture
# Technologies Used

1. React

 - Frontend JavaScript library for building user interfaces.
 - Key Features: Component-based architecture, virtual DOM, and JSX syntax.

2. Node.js

 - Backend JavaScript runtime environment.
 - Key Features: Asynchronous event-driven model, fast execution for I/O-heavy operations.

3. MongoDB

 - NoSQL database for storing data in a JSON-like format.
 - Key Features: Flexible schema, scalability, and support for complex queries.

# Project Architecture

 - Frontend: React handles the user interface and communicates with the backend via REST APIs.
 - Backend: Node.js provides an API layer for business logic and manages data flow between the frontend and database.
 - Database: MongoDB stores application data, such as user details, configurations, and logs.
 - CI/CD Pipeline: Automated processes for testing, building, and deploying changes to the application.

#  Differences Between Development and Production Configurations
# Development Configuration

 - Environment Variables: Use .env file with development-specific keys.
 - Debugging: Enabled for both frontend and backend.
 - Caching: Disabled to reflect real-time changes during development.
 - Database: Local MongoDB instance with test datasets.
 - Logging: Verbose logging for debugging purposes.
 - Frontend: Development mode enabled in React, with features like hot-reloading.
 - CI/CD: Run tests but skip deployment.

# Production Configuration

 - Environment Variables: Secure keys stored in CI/CD pipeline or a vault.
 - Debugging: Disabled to enhance security and performance.
 - Caching: Enabled for optimized performance.
 - Database: Remote MongoDB instance with production data.
 - Logging: Minimal logs with essential information.
 - Frontend: Built React app optimized for performance.
 - CI/CD: Includes full tests, build, and deployment steps.

# Pipeline Stages
1. Triggers

 - Push or merge requests to the main branch trigger the pipeline.
 - Manual trigger options for production deployments.

2. Tests

 - Run unit tests, integration tests, and E2E tests using frameworks like Jest or Cypress.
 - Linting and code analysis.

3. Build

 - Backend: Compile dependencies using npm install.
 - Frontend: Build React application using npm run build.

4. Deployment

 - Development: Automatic deployment to a staging environment.
 - Production: Manual approval required for deployment to production.

# Diagram
![deployment diagram](docs/deployment.png)

# Installation

1. Install Dependencies:

 - Ensure curl is installed.
 - For Debian/Ubuntu: sudo apt update && sudo apt install -y curl.

2. Download GitLab Runner:

 - Execute:
curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64

3. Set Permissions:

 - Run:
chmod +x /usr/local/bin/gitlab-runner

 4. Install as a Service:

 - Execute:
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
sudo gitlab-runner start

# Configuration
1. Register a Runner:

 - Run the command:
gitlab-runner register

 - Follow the prompts:
  - Enter your GitLab instance URL.
  - Enter the token from your GitLab project settings under CI/CD > Runners.
  - Choose an executor (docker or shell).

2. Docker Executor Setup (Optional):

 - Install Docker:
sudo apt install -y docker.io
 - Configure docker as the executor during the registration process.

3. Verify Runner:

 - Check runner status in GitLab under CI/CD > Runners to ensure it’s online.
