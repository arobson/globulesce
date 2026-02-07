.PHONY: help build test coverage clean release

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Compile TypeScript to JavaScript
	npx tsc

test: ## Run tests
	npx vitest run

coverage: ## Run tests with coverage report
	npx vitest run --coverage

clean: ## Remove build artifacts and coverage reports
	rm -rf dist/ coverage/ *.tsbuildinfo

release: clean build test ## Clean, build, test, and create a new release
	npx standard-version
