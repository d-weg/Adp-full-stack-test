# ADP Ventures — Full-Stack Coding Exercise

A web application that displays employment counts by U.S. state with optional breakdown by sex, built with Node.js (backend) and React/Next.js (frontend).

## Features

- **State Selection**: Multi-select dropdown with "All States" option and all 50 U.S. states + DC
- **Quarter Selection**: Dropdown with quarters from 2023-Q4 to 2020-Q1 (descending order)
- **Sex Breakdown**: Optional toggle to show employment data by Male/Female
- **Dynamic Header**: Shows selected states and quarter
- **Sortable Table**: Click column headers to sort by State, Male, Female, or Total Employment
- **Loading States**: Clear loading, empty, and error states
- **Real-time API**: Fetches data from U.S. Census Bureau Quarterly Workforce Indicators API

## Installation & Setup

This application can be run in two ways:
1. **Local Development** - Direct Node.js execution with full API access
2. **Docker Deployment** - Containerized with internal network security

### Prerequisites

**For Local Development:**
- Node.js (v18 or higher)
- npm

**For Docker Deployment:**
- Docker & Docker Compose

## Deployment Options

### Option 1: Local Development (Recommended for Development)

#### Installation
```bash
# Clone and install
git clone <repository-url>
cd adp
npm install
```

#### Running Locally
```bash
# Development mode with hot reload
npm run dev

# Or build and run production locally
npm run build
npm run start
```

**Local Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000 (accessible externally)
- API Documentation: http://localhost:8000/docs

#### Individual Services
```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend
```

### Option 2: Docker Deployment (Recommended for Production)

#### Quick Start
```bash
# Clone repository (if not already done)
git clone <repository-url>
cd adp

# Build and run with Docker Compose
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**Docker Access:**
- Frontend: http://localhost:3000
- Backend API: **Not accessible externally** (internal network only)

**Security Features:**
- Backend API runs on an internal Docker network (`app-network`)
- Frontend communicates with backend using internal service name (`http://backend:8000`)
- Only the frontend web interface (port 3000) is accessible from outside
- Backend API is secured and not exposed to the host machine

#### Individual Docker Builds (Advanced)
```bash
# Build backend
docker build -f apps/backend/Dockerfile -t adp-backend .

# Build frontend  
docker build -f apps/frontend/Dockerfile -t adp-frontend .

# Note: Individual containers won't have network connectivity
# Use docker-compose for full functionality
```

### Environment Variables

The application supports several environment variables for customization, **all with sensible defaults**:

#### Frontend Environment Variables (Optional)
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000  # Default: http://localhost:8000
```

#### Backend Environment Variables (Optional)
```bash
# Backend (.env)
PORT=8000                    # Default: 8000
HOST=0.0.0.0                # Default: 0.0.0.0
CENSUS_API_BASE=https://api.census.gov/data/timeseries/qwi/sa  # Default: https://api.census.gov/data/timeseries/qwi/sa
```

#### Default Behavior
- **No configuration required**: The app works out of the box without any environment variables
- **Frontend**: Automatically connects to `http://localhost:8000` for local development
- **Backend**: Runs on port `8000` with host `0.0.0.0` and uses the official Census API
- **Docker**: Environment variables are pre-configured in `docker-compose.yml`

**Docker Environment Variables:**
- Backend runs on port 8000 in containers (internal access only)
- Frontend automatically configured to connect to `backend:8000` in Docker network
- `NEXT_PUBLIC_API_URL=http://backend:8000` (uses internal service name for container communication)
- All URLs can be customized by modifying the `docker-compose.yml` file

## Architecture

### Project Structure
```
adp/ (Turbo Monorepo)
├── apps/
│   ├── backend/               # Fastify API server
│   │   ├── src/
│   │   │   ├── constants/         # State codes and other constants
│   │   │   ├── services/          # External API clients
│   │   │   ├── utils/             # HTTP utilities and types
│   │   │   └── workforce/         # Main API endpoints and business logic
│   │   ├── Dockerfile             # Backend container configuration
│   │   └── package.json           # Backend dependencies
│   └── frontend/              # Next.js React application (standalone output)
│       ├── src/
│       │   ├── actions/           # Server actions for data fetching
│       │   ├── components/        # React components
│       │   ├── hooks/             # Custom React hooks
│       │   ├── services/          # API client
│       │   ├── types/             # TypeScript interfaces
│       │   └── utils/             # HTTP client utilities
│       ├── Dockerfile             # Frontend container configuration
│       ├── next.config.ts         # Next.js config with standalone output
│       └── package.json           # Frontend dependencies
├── docker-compose.yml         # Docker orchestration
├── turbo.json                 # Turbo build configuration  
└── package.json               # Root workspace configuration
```

### Data Flow

1. **User Interaction**: User selects states, quarter, and breakdown options
2. **Frontend Request**: Next.js server action calls backend API with filters
3. **Backend Processing**: 
   - Validates request parameters
   - Makes multiple calls to Census API (one per state, one per sex if breakdown enabled)
   - Aggregates and transforms response data
4. **Frontend Display**: 
   - Transforms API response to UI data format
   - Updates table with sortable employment data
   - Shows loading/error states as needed

### API Integration

**Census Bureau API**: `https://api.census.gov/data/timeseries/qwi/sa`
- **Parameters**: `get=Emp&for=state:XX&time=YYYY-QX&sex=X`
- **State Codes**: FIPS codes (01-56, excluding 03, 07, 14, 43, 52)
- **Sex Codes**: 0=All, 1=Male, 2=Female
- **Time Format**: YYYY-QX (e.g., 2023-Q4)

### Key Technical Decisions

#### Backend (Fastify)
- **TypeBox**: Schema validation and API documentation
- **Multiple API Calls**: When breakdown by sex is enabled, makes separate calls for male/female data
- **State Handling**: Supports both single state and multiple states (including "ALL")
- **Error Handling**: Comprehensive error handling with meaningful messages

#### Frontend (Next.js 15)
- **Server Actions**: Uses Next.js server actions for type-safe API calls
- **Custom Hooks**: `useEmploymentData` for state management
- **Responsive Design**: Tailwind CSS for responsive UI
- **TypeScript**: Full type safety throughout the application

### Trade-offs

1. **Multiple API Calls vs Single Call**: 
   - **Chosen**: Multiple calls for sex breakdown
   - **Trade-off**: More network requests but more accurate data aggregation
   
2. **Client vs Server State Management**:
   - **Chosen**: React state with server actions
   - **Trade-off**: Simpler implementation but less sophisticated caching

3. **Monorepo vs Separate Repos**:
   - **Chosen**: Turbo monorepo with workspaces
   - **Trade-off**: Easier development and deployment but single repository management

4. **Docker vs Local Deployment**:
   - **Chosen**: Both options supported
   - **Trade-off**: Docker provides consistency across environments but adds complexity

5. **API Architecture vs Next.js Server Actions**:
   - **Chosen**: Separate API backend with dedicated Fastify server
   - **Alternative**: Could have implemented all logic using Next.js server actions or API routes
   - **Trade-off**: As this is a full-stack coding exercise, I chose to demonstrate both frontend and backend skills by creating a dedicated API. However, for a real-world scenario, implementing this purely with Next.js server actions would reduce complexity, eliminate network latency between services, simplify deployment, provide better type safety with shared code, and offer seamless server-client integration. The separate API approach offers better separation of concerns, independent scaling, and reusability across different frontends.

### Technical Stack

- **Monorepo Management**: Turborepo for build optimization and task orchestration
- **Backend**: Fastify with TypeBox validation
- **Frontend**: Next.js 15 with standalone output for Docker optimization
- **Containerization**: Docker with multi-stage builds for production optimization
- **Orchestration**: Docker Compose for local multi-service development

## API Documentation

The backend provides Swagger/OpenAPI documentation at `/docs` when running in development mode.

### Main Endpoint
```
GET /v1/workforce
```

**Query Parameters**:
- `states`: Array of state codes or "ALL"
- `time`: Quarter in format YYYY-QX
- `breakdownBySex`: Boolean for sex breakdown

**Response**:
```json
{
  "data": [
    {
      "employeeCount": 2234567,
      "state": "01",
      "quarter": "2023-Q4", 
      "sex": "All"
    }
  ]
}
```

## Testing

```bash
# Run all tests across the monorepo
npm run test

# Run linting across all projects
npm run lint

# Build all projects (includes type checking)
npm run build

# Test individual services
npm run test --filter=@adp/backend
npm run lint --filter=@adp/frontend
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Run with Docker
docker-compose up --build

# Clean build artifacts (Turbo cache)
npx turbo clean
```