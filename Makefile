.PHONY: help docker-build docker-run docker-stop k8s-deploy k8s-cleanup k8s-status minikube-start minikube-stop test clean

help:
	@echo "🎓 VIA Tabloid - DevOps Commands"
	@echo "=================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📚 Example workflow:"
	@echo "  make docker-build    # Build images"
	@echo "  make docker-run      # Test locally"
	@echo "  make minikube-start  # Start Kubernetes"
	@echo "  make k8s-deploy      # Deploy to K8s"

docker-build: # Build Docker images for local development
	@echo "🔨 Building Docker images..."
	@echo "Building backend..."
	docker build -t viatab-backend:local ./viatab-backend
	@echo "Building frontend..."
	docker build -t viatab-frontend:local ./viatab-frontend
	@echo "✅ Docker images built successfully!"

docker-run: # Start application with Docker Compose
	@echo "🚀 Starting VIA Tabloid with Docker Compose..."
	docker-compose -f docker-compose.local.yml up -d
	@echo "✅ Application started!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔗 Backend: http://localhost:8080"
	@echo "🗄️ Database: localhost:5432"

docker-dev:
	@echo "🔨 Starting VIA Tabloid in development mode (building from source)..."
	docker-compose up -d
	@echo "✅ Application started!"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🔗 Backend: http://localhost:8080"
	@echo "🗄️ Database: localhost:5432"

docker-stop: # Stop Docker Compose application
	@echo "🛑 Stopping Docker Compose..."
	docker-compose -f docker-compose.local.yml down
	@echo "✅ Application stopped!"

docker-logs: # Show Docker Compose logs
	@echo "📋 Docker Compose logs:"
	docker-compose -f docker-compose.local.yml logs -f

docker-clean: # Remove Docker images and containers
	@echo "🧹 Cleaning up Docker..."
	docker-compose -f docker-compose.local.yml down -v
	docker rmi viatab-backend:local viatab-frontend:local 2>/dev/null || true
	@echo "✅ Docker cleanup complete!"

# Kubernetes
minikube-start:
	@echo "🎯 Starting Minikube..."
	minikube start --driver=docker --memory=4096 --cpus=2
	@echo "🔌 Enabling ingress addon..."
	minikube addons enable ingress
	@echo "✅ Minikube started successfully!"
	@echo "📊 Cluster info:"
	kubectl cluster-info

minikube-stop:
	@echo "🛑 Stopping Minikube..."
	minikube stop
	@echo "✅ Minikube stopped!"

minikube-delete:
	@echo "🗑️ Deleting Minikube cluster..."
	minikube delete
	@echo "✅ Minikube cluster deleted!"

k8s-load-images:
	@echo "📦 Loading images into Minikube..."
	@eval $$(minikube docker-env) && \
	docker build -t viatab-backend:latest ./viatab-backend && \
	docker build -t viatab-frontend:latest ./viatab-frontend
	@echo "✅ Images loaded into Minikube!"

k8s-deploy:
	@echo "🚀 Deploying VIA Tabloid to Kubernetes..."
	@chmod +x scripts/deploy-k8s.sh
	@./scripts/deploy-k8s.sh

k8s-cleanup:
	@echo "🧹 Cleaning up Kubernetes deployment..."
	@chmod +x scripts/cleanup-k8s.sh
	@./scripts/cleanup-k8s.sh

k8s-status:
	@echo "📊 Kubernetes Status:"
	@echo ""
	@echo "🎯 Namespace:"
	kubectl get namespace viatab 2>/dev/null || echo "❌ Namespace 'viatab' not found"
	@echo ""
	@echo "📦 Pods:"
	kubectl get pods -n viatab 2>/dev/null || echo "❌ No pods found in namespace 'viatab'"
	@echo ""
	@echo "🔗 Services:"
	kubectl get services -n viatab 2>/dev/null || echo "❌ No services found in namespace 'viatab'"
	@echo ""
	@echo "🚀 Deployments:"
	kubectl get deployments -n viatab 2>/dev/null || echo "❌ No deployments found in namespace 'viatab'"

k8s-logs:
	@echo "📋 Application logs:"
	@echo ""
	@echo "🖥️ Backend logs:"
	kubectl logs -l app=viatab-backend -n viatab --tail=20 2>/dev/null || echo "❌ Backend not running"
	@echo ""
	@echo "🌐 Frontend logs:"
	kubectl logs -l app=viatab-frontend -n viatab --tail=20 2>/dev/null || echo "❌ Frontend not running"

k8s-port-forward:
	@echo "🔌 Setting up port forwarding..."
	@echo "🌐 Frontend will be available at: http://localhost:3000"
	@echo "🔗 Backend will be available at: http://localhost:8080"
	@echo "Press Ctrl+C to stop port forwarding"
	kubectl port-forward -n viatab service/frontend-service 3000:3000 &
	kubectl port-forward -n viatab service/backend-service 8080:8080

k8s-urls:
	@echo "🌍 Service URLs:"
	@echo ""
	@echo "🌐 Frontend:"
	@minikube service frontend-service -n viatab --url 2>/dev/null || echo "❌ Frontend service not available"
	@echo ""
	@echo "🔗 Backend:"
	@minikube service backend-service -n viatab --url 2>/dev/null || echo "❌ Backend service not available"

# Development
test:
	@echo "🧪 Running tests..."
	@echo "Testing backend..."
	cd viatab-backend && ./mvnw test
	@echo "Testing frontend..."
	cd viatab-frontend && npm test -- --watchAll=false
	@echo "✅ All tests completed!"

build:
	@echo "🔨 Building applications..."
	@echo "Building backend..."
	cd viatab-backend && ./mvnw clean package -DskipTests
	@echo "Building frontend..."
	cd viatab-frontend && npm run build
	@echo "✅ Applications built successfully!"

clean:
	@echo "🧹 Cleaning build artifacts..."
	cd viatab-backend && ./mvnw clean 2>/dev/null || true
	cd viatab-frontend && rm -rf .next node_modules/.cache 2>/dev/null || true
	@echo "✅ Build artifacts cleaned!"

install:
	@echo "📦 Installing dependencies..."
	@echo "Installing backend dependencies..."
	cd viatab-backend && ./mvnw dependency:resolve
	@echo "Installing frontend dependencies..."
	cd viatab-frontend && npm install
	@echo "✅ Dependencies installed!"

# Complete workflows
dev-setup: # Complete development setup
	@echo "🛠️ Setting up development environment..."
	make install
	make docker-build
	@echo "✅ Development environment ready!"
	@echo ""
	@echo "🚀 Next steps:"
	@echo "  make docker-run      # Start with Docker"
	@echo "  make minikube-start  # Start Kubernetes"
	@echo "  make k8s-deploy      # Deploy to K8s"

demo: # Demo workflow for presentation
	@echo "🎬 VIA Tabloid Demo Workflow"
	@echo "=========================="
	@echo ""
	@echo "Step 1: Building Docker images..."
	make docker-build
	@echo ""
	@echo "Step 2: Testing with Docker Compose..."
	make docker-run
	@echo ""
	@echo "⏳ Waiting for services to start..."
	sleep 10
	@echo ""
	@echo "Step 3: Checking if services are running..."
	curl -f http://localhost:8080/actuator/health || echo "⚠️ Backend not ready yet"
	@echo ""
	@echo "Step 4: Starting Kubernetes..."
	make minikube-start
	@echo ""
	@echo "Step 5: Deploying to Kubernetes..."
	make k8s-load-images
	make k8s-deploy
	@echo ""
	@echo "🎉 Demo complete! Check the status:"
	make k8s-status

cleanup-all: # Complete cleanup (Docker + Kubernetes)
	@echo "🧹 Complete cleanup..."
	make docker-stop
	make docker-clean
	make k8s-cleanup
	make minikube-stop
	@echo "✅ Everything cleaned up!"

# Information
info:
	@echo "ℹ️ System Information:"
	@echo "====================="
	@echo ""
	@echo "🐳 Docker:"
	@docker --version 2>/dev/null || echo "❌ Docker not installed"
	@echo ""
	@echo "☸️ Kubectl:"
	@kubectl version --client 2>/dev/null | head -1 || echo "❌ Kubectl not installed"
	@echo ""
	@echo "🎯 Minikube:"
	@minikube version 2>/dev/null | head -1 || echo "❌ Minikube not installed"
	@echo ""
	@echo "🔧 Make:"
	@make --version | head -1
	@echo ""
	@echo "📂 Project structure:"
	@ls -la | grep -E "(viatab-|k8s|scripts|docker-compose)"
