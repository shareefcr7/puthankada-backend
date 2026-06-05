# CORS Configuration Guide

## Overview
This document explains the CORS (Cross-Origin Resource Sharing) configuration for the Puthan-Kada backend server.

## Current Configuration

### Allowed Origins
The server accepts requests from the following origins:

#### Production Domains
- `https://puthan-kada.vercel.app` - Main frontend
- `https://admin.puthan-kada.vercel.app` - Admin panel
- `https://puthankada.co.in` - Production domain
- `https://admin.puthankada.co.in` - Admin production domain
- `https://www.puthankada.co.in` - WWW variant
- `https://www.admin.puthankada.co.in` - WWW admin variant

#### Development Domains
- `http://localhost:3000` - Frontend development
- `http://localhost:3001` - Admin development
- `http://localhost:3002` - Additional dev port
- `http://localhost:3003` - Additional dev port
- `http://127.0.0.1:3000-3003` - Localhost IP variants
- `http://localhost:4000` - Alternative dev port
- `http://localhost:5000` - Alternative dev port
- `http://localhost:8000` - Alternative dev port
- `http://localhost:8080` - Alternative dev port

#### Legacy Domains (Backward Compatibility)
- `https://admin.gracefoods.co.in`
- `https://gracefoods.co.in`

### Allowed Methods
- `GET` - Read operations
- `POST` - Create operations
- `PUT` - Update operations
- `DELETE` - Delete operations
- `OPTIONS` - Preflight requests
- `PATCH` - Partial updates

### Allowed Headers
- `Content-Type` - Request content type
- `Authorization` - JWT tokens
- `X-Requested-With` - AJAX requests
- `Accept` - Response format
- `Origin` - Request origin
- `Cache-Control` - Cache directives
- `Pragma` - HTTP/1.0 cache
- `X-HTTP-Method-Override` - Method override
- `X-Forwarded-For` - Client IP
- `X-Real-IP` - Real client IP

### Configuration Files

#### 1. Main CORS Middleware (`/middleware/cors.js`)
Contains the main CORS configuration with:
- Dynamic origin validation
- Environment variable support
- Comprehensive error handling
- Preflight request handling

#### 2. Server Configuration (`/index.js`)
- Imports and applies CORS middleware
- Sets up preflight OPTIONS handler
- Adds CORS error handling

#### 3. Environment Variables (`/.env`)
```env
ALLOWED_ORIGINS=https://puthan-kada.vercel.app,https://admin.puthan-kada.vercel.app,...
```

## Environment Configuration

### Adding New Origins
To add new allowed origins:

1. **Via Environment Variable:**
   ```env
   ALLOWED_ORIGINS=existing_origins,https://new-domain.com
   ```

2. **Via Code (for permanent additions):**
   Edit `/middleware/cors.js` and add to the `defaultOrigins` array.

### Production vs Development
- **Development:** Includes localhost and 127.0.0.1 variants
- **Production:** Focuses on HTTPS domains and specific ports

## Testing CORS

### Manual Testing
Use the provided test script:
```bash
node test-cors.js
```

### Browser Testing
1. Open browser dev tools
2. Check Network tab for CORS errors
3. Look for preflight OPTIONS requests
4. Verify `Access-Control-*` headers

### Common CORS Errors

#### 1. Origin Not Allowed
```
CORS blocked origin: https://unauthorized-domain.com
```
**Solution:** Add the domain to allowed origins

#### 2. Method Not Allowed
```
Method PUT not allowed by CORS
```
**Solution:** Add method to `methods` array

#### 3. Header Not Allowed
```
Header 'X-Custom-Header' not allowed by CORS
```
**Solution:** Add header to `allowedHeaders` array

## Troubleshooting

### 1. Check Server Logs
Look for CORS-related log messages:
```
🚫 CORS blocked origin: https://example.com
📋 Allowed origins: ...
```

### 2. Verify Environment Variables
```bash
echo $ALLOWED_ORIGINS
```

### 3. Test with curl
```bash
curl -H "Origin: https://puthan-kada.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     http://localhost:5001/api
```

### 4. Browser Dev Tools
- Network tab shows CORS errors
- Console shows detailed error messages
- Response headers show CORS configuration

## Security Considerations

### 1. Origin Validation
- Never use wildcard (`*`) for credentials: true
- Validate origins dynamically
- Log blocked requests for security monitoring

### 2. Credential Handling
- `credentials: true` allows cookies/auth headers
- Only enable for trusted origins
- Use HTTPS in production

### 3. Header Restrictions
- Only allow necessary headers
- Avoid exposing sensitive headers
- Validate custom headers

## Deployment Notes

### Vercel/Netlify
- Set environment variables in dashboard
- Use deployment-specific origins
- Test with preview URLs

### Render/Railway
- Configure environment variables
- Use service URLs in origins
- Enable HTTPS redirects

### Docker
- Pass origins via environment
- Use container networking considerations
- Configure reverse proxy CORS if applicable

## Updates and Maintenance

### Regular Reviews
- Audit allowed origins quarterly
- Remove unused/old domains
- Update for new deployment environments

### Version Control
- Document origin changes in commits
- Use environment variables for deployment-specific origins
- Maintain backward compatibility when possible

### Monitoring
- Log CORS blocks for security analysis
- Monitor legitimate request failures
- Track origin usage patterns