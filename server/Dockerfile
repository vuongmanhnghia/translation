FROM golang:alpine AS builder

WORKDIR /build

# Install build dependencies
RUN apk --no-cache add ca-certificates git

# Copy go mod files first for better caching
COPY go.mod go.sum ./

RUN go mod download

# Copy source code
COPY . .

# Build with optimized flags
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o server main.go

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

# Create app directory
WORKDIR /app

# Copy configs first
COPY ./configs /app/configs

# Copy CA certificates from builder (alpine already has them, but ensuring consistency)
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy binary from builder
COPY --from=builder /build/server .

# Make binary executable
RUN chmod +x ./server

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 8080

# Use absolute path for config
ENTRYPOINT ["./server", "/app/configs/config.yaml"]