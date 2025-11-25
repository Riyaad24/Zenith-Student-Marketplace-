.PHONY: install dev build tag

install:
	cd Zenith-OG && npm ci

dev:
	cd Zenith-OG && npm run dev

build:
	cd Zenith-OG && npm run build

tag:
	@echo "Creating annotated rc tag..."
	@read -p "Tag name (e.g. v2.1.0-rc1): " t; \
	git tag -a $$t -m "Release candidate $$t"; \
	git push origin $$t
