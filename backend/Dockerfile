ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-alpine

# Utiliser l'environnement de production par défaut.
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Installer les dépendances sans utiliser BuildKit
COPY package.json package-lock.json ./
RUN if [ "$NODE_ENV" = "production" ]; then \
        npm ci --omit=dev; \
    else \
        NODE_ENV=development npm ci; \
    fi

# Copier le reste des fichiers sources dans l'image
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000


# Ajouter les permissions d'exécution aux scripts
COPY entrypoint.sh wait-for-it.sh ./
RUN chmod +x ./entrypoint.sh ./wait-for-it.sh

# Exécuter l'application en tant qu'utilisateur non-root
USER node


# Exécuter l'application
CMD ["sh", "./entrypoint.sh"]