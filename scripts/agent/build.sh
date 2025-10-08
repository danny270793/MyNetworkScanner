#!/bin/bash

# Network Scanner Agent Build Script
# This script builds the agent Docker image and publishes it to a private registry

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
REGISTRY_URL=""
IMAGE_NAME="network-scanner-agent"
TAG="latest"
VERSION=""
BUILD_ARGS=""
PUSH_IMAGE=false
HELP=false

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    cat << EOF
Network Scanner Agent Build Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -r, --registry URL     Private registry URL (required for push)
    -n, --name NAME        Image name (default: network-scanner-agent)
    -t, --tag TAG          Image tag (default: latest)
    -v, --version VERSION  Version tag (will create both version and latest tags)
    -p, --push             Push image to registry after building
    -b, --build-args ARGS  Additional Docker build arguments
    -h, --help             Show this help message

EXAMPLES:
    # Build image locally only
    $0

    # Build and push to private registry
    $0 -r registry.example.com -p

    # Build with specific version and push
    $0 -r registry.example.com -v 1.2.3 -p

    # Build with custom name and tag
    $0 -r registry.example.com -n my-scanner -t v1.0.0 -p

    # Build with additional build arguments
    $0 -b "--no-cache --build-arg NODE_ENV=production"

REQUIREMENTS:
    - Docker must be installed and running
    - If pushing, you must be logged in to the registry
    - The script must be run from the project root directory

EOF
}

# Function to validate prerequisites
validate_prerequisites() {
    print_info "Validating prerequisites..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running or not accessible"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "agent/Dockerfile" ]; then
        print_error "Dockerfile not found. Please run this script from the project root directory"
        exit 1
    fi
    
    # Check if .env file exists (optional but recommended)
    if [ ! -f "agent/.env" ]; then
        print_warning ".env file not found in agent directory. Make sure to set environment variables"
    fi
    
    print_success "Prerequisites validated"
}

# Function to build the Docker image
build_image() {
    local full_image_name="$1"
    local build_context="$2"
    
    print_info "Building Docker image: $full_image_name"
    print_info "Build context: $build_context"
    
    # Build the image
    if docker build \
        --file "$build_context/Dockerfile" \
        --tag "$full_image_name" \
        $BUILD_ARGS \
        "$build_context"; then
        print_success "Image built successfully: $full_image_name"
    else
        print_error "Failed to build image: $full_image_name"
        exit 1
    fi
}

# Function to push image to registry
push_image() {
    local full_image_name="$1"
    
    if [ -z "$REGISTRY_URL" ]; then
        print_error "Registry URL is required for pushing images"
        exit 1
    fi
    
    print_info "Pushing image to registry: $full_image_name"
    
    if docker push "$full_image_name"; then
        print_success "Image pushed successfully: $full_image_name"
    else
        print_error "Failed to push image: $full_image_name"
        exit 1
    fi
}

# Function to create and push version tags
create_version_tags() {
    local base_image="$1"
    local version_tag="$2"
    
    if [ -n "$VERSION" ]; then
        print_info "Creating version tag: $version_tag"
        docker tag "$base_image" "$version_tag"
        
        if [ "$PUSH_IMAGE" = true ]; then
            push_image "$version_tag"
        fi
    fi
}

# Function to show image information
show_image_info() {
    local full_image_name="$1"
    
    print_info "Image information:"
    echo "  Name: $full_image_name"
    echo "  Size: $(docker images --format "table {{.Size}}" "$full_image_name" | tail -n 1)"
    echo "  Created: $(docker images --format "table {{.CreatedAt}}" "$full_image_name" | tail -n 1)"
    
    if [ -n "$VERSION" ]; then
        local version_tag="${REGISTRY_URL:+$REGISTRY_URL/}$IMAGE_NAME:$VERSION"
        echo "  Version Tag: $version_tag"
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -r|--registry)
            REGISTRY_URL="$2"
            shift 2
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -p|--push)
            PUSH_IMAGE=true
            shift
            ;;
        -b|--build-args)
            BUILD_ARGS="$2"
            shift 2
            ;;
        -h|--help)
            HELP=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Show help if requested
if [ "$HELP" = true ]; then
    show_help
    exit 0
fi

# Main execution
main() {
    print_info "Starting Network Scanner Agent build process..."
    
    # Validate prerequisites
    validate_prerequisites
    
    # Construct full image name
    local full_image_name
    if [ -n "$REGISTRY_URL" ]; then
        full_image_name="$REGISTRY_URL/$IMAGE_NAME:$TAG"
    else
        full_image_name="$IMAGE_NAME:$TAG"
    fi
    
    # Build the image
    build_image "$full_image_name" "agent"
    
    # Create version tag if specified
    if [ -n "$VERSION" ]; then
        local version_tag="${REGISTRY_URL:+$REGISTRY_URL/}$IMAGE_NAME:$VERSION"
        create_version_tags "$full_image_name" "$version_tag"
    fi
    
    # Push image if requested
    if [ "$PUSH_IMAGE" = true ]; then
        push_image "$full_image_name"
    fi
    
    # Show image information
    show_image_info "$full_image_name"
    
    print_success "Build process completed successfully!"
    
    # Show usage instructions
    if [ "$PUSH_IMAGE" = true ]; then
        echo
        print_info "To use this image:"
        echo "  docker run -d --name network-scanner-agent \\"
        echo "    -e SUPABASE_URL=your_supabase_url \\"
        echo "    -e SUPABASE_KEY=your_supabase_key \\"
        echo "    -e NETWORK_NAME=your_network_name \\"
        echo "    --network host \\"
        echo "    --cap-add NET_RAW --cap-add NET_ADMIN \\"
        echo "    $full_image_name"
    else
        echo
        print_info "To push this image to a registry:"
        echo "  $0 -r your-registry.com -p"
    fi
}

# Run main function
main "$@"
