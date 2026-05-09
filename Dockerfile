ARG NODE_VERSION=24.2.0
ARG PNPM_VERSION=11.0.3

FROM node:${NODE_VERSION}-alpine AS builder

# Use production node environment by default.
ENV NODE_ENV production

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_OAUTH_GOOGLE_CLIENT_ID

ENV VITE_API_BASE_URL ${VITE_API_BASE_URL}
ENV VITE_OAUTH_GOOGLE_CLIENT_ID ${OAUTH_GOOGLE_CLIENT_ID}

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage a bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Build
RUN pnpm build

# production environment
FROM nginx:stable-alpine AS runner

# fix some permissions
RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid

COPY --chown=nginx:nginx --from=builder /app/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
