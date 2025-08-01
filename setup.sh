#!/bin/bash

# Vistagram Setup Script
echo "🚀 Setting up Vistagram MERN Stack Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 14+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v) ✓"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    print_status "MongoDB found on system ✓"
else
    print_warning "MongoDB not found locally. Make sure MongoDB is running or use MongoDB Atlas."
fi

print_header "\n📦 Installing Dependencies..."

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
if npm install; then
    print_status "Backend dependencies installed ✓"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
if npm install; then
    print_status "Frontend dependencies installed ✓"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

print_header "\n⚙️  Configuration Setup..."

# Create environment files
if [ ! -f "backend/.env" ]; then
    print_status "Creating backend environment file..."
    cp backend/.env.example backend/.env
    print_warning "Please update backend/.env with your actual configuration values:"
    print_warning "  - MongoDB URI"
    print_warning "  - Cloudinary credentials"
fi

if [ ! -f "frontend/.env" ]; then
    print_status "Creating frontend environment file..."
    cp frontend/.env.example frontend/.env
    print_status "Frontend .env created with default values ✓"
fi

print_header "\n📊 Database Setup..."
print_status "To seed your database with sample data, run:"
print_status "  npm run seed"
print_warning "Make sure MongoDB is running and .env is configured first!"

print_header "\n🏃‍♂️ Running the Application..."
print_status "Start the application with:"
print_status "  npm run dev        # Start both backend and frontend"
print_status "  npm run server     # Start backend only"
print_status "  npm run client     # Start frontend only"

print_header "\n📱 Application URLs:"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:5000/api"
print_status "Health Check: http://localhost:5000/api/health"

print_header "\n📚 Next Steps:"
echo "1. Configure your environment variables in backend/.env"
echo "2. Start MongoDB (if using local database)"
echo "3. Run 'npm run seed' to create sample data"
echo "4. Run 'npm run dev' to start the application"
echo "5. Open http://localhost:3000 in your browser"

print_header "\n🚀 For Deployment:"
print_status "Check out deployment-guide.md for detailed deployment instructions"

echo ""
echo -e "${GREEN}Setup complete! 🎉${NC}"
echo -e "${BLUE}Happy coding! 📸${NC}"