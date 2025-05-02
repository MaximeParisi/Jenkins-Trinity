# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}


# Utiliser l'environnement de production par défaut.
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Installer les dépendances
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    if [ "$NODE_ENV" = "production" ]; then \
        npm ci --omit=dev; \
    else \
        NODE_ENV=development npm ci; \
    fi

# Exécuter l'application en tant qu'utilisateur non-root
USER node

# Copier le reste des fichiers sources dans l'image
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Exécuter l'application
COPY --chmod=0755 entrypoint.sh /usr/src/app/entrypoint.sh
COPY --chmod=0755 wait-for-it.sh /usr/src/app/wait-for-it.sh
CMD ["sh", "/usr/src/app/entrypoint.sh"]
