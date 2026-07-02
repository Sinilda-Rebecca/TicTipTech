from app.database import Base, engine
from app.models import Project
from sqlalchemy.orm import sessionmaker

SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

def seed():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)

    # Clean existing projects
    db.query(Project).delete()

    projects = [
        Project(
            key="cisco",
            title="Cisco Enterprise Dashboard",
            desc="Decoupled cloud architecture displaying real-time metrics for enterprise scale deployments.",
            img="../images/cisco.jpg",
            category="frontend",
            tags="Web, App",
            frontendText="Fully componentized client dashboard styled using CSS custom properties and structured grid logic. Handshakes with secure API endpoints using React query hooks to render complex charts with latency < 50ms.",
            frontendTech="React 18, TypeScript, Chart.js",
            backendText="Decoupled FastAPI service layer routing telemetry logs through Redis channels into timescale storage instances. Completely partitioned from public domains using authenticated VPC boundaries.",
            backendApi="REST, WebSockets (FastAPI)",
            backendDb="PostgreSQL, TimescaleDB"
        ),
        Project(
            key="punto",
            title="Punto Pago Fintech Portal",
            desc="Secure mobile-first checkout workflow handling transaction reconciliation mechanisms.",
            img="../images/punto.jpg",
            category="frontend",
            tags="Mobile, App",
            frontendText="Multi-layered progressive web app optimized for mobile viewports. Utilizes lazy-loaded visual components and client-side offline memory caching strategies.",
            frontendTech="React Native Web, Vite, Redux Toolkit",
            backendText="Transaction microservice running on distributed cluster containers. Synchronizes client accounts with PCI-compliant payment gateways under robust retry mechanics.",
            backendApi="gRPC, REST Gateways",
            backendDb="MongoDB, Redis Cache"
        ),
        Project(
            key="nurse",
            title="Nurse Club Platform",
            desc="Healthcare staffing scheduler orchestrating availability matches across medical facilities.",
            img="../images/nurse.jpg",
            category="frontend",
            tags="Web, App",
            frontendText="A scheduling interface enabling swift calendar queries, drag-and-drop assignments, and immediate alert popups via web socket callbacks.",
            frontendTech="Vue 3, Pinia, TailwindCSS",
            backendText="Decoupled scheduling algorithms processing reservation windows and validating nurse license status asynchronously.",
            backendApi="GraphQL Subscriptions",
            backendDb="PostgreSQL, RabbitMQ"
        ),
        Project(
            key="daoway",
            title="Daoway Marketplace",
            desc="Distributed services exchange portal connecting users with verified providers.",
            img="../images/daoway.jpg",
            category="frontend",
            tags="Web, Marketplace",
            frontendText="Search-oriented portal containing customizable filters, interactive maps, and responsive vendor details panels.",
            frontendTech="Next.js (App Router), Sass",
            backendText="Robust service catalog backend with geosearch indices. Decoupled search engines process queries in sub-second response times.",
            backendApi="RESTful API, ElasticSearch",
            backendDb="PostgreSQL, Redis"
        ),
        Project(
            key="kelvin",
            title="Kelvin Zero Identity Server",
            desc="Zero trust authentication layer authorizing resource tokens for system services.",
            img="../images/kelvin.jpg",
            category="backend",
            tags="App, Security",
            frontendText="Biometric validation flows, multi-factor credential input cards, and cryptographical keys manager UI.",
            frontendTech="React, WebAuthn API",
            backendText="Zero-Trust credential validation engine supporting FIDO2 protocol models and issuing securely signed JWT tokens.",
            backendApi="OAuth2 / OIDC Gateway",
            backendDb="PostgreSQL, HashiCorp Vault"
        ),
        Project(
            key="nurse-api",
            title="Nurse Club API",
            desc="REST & GraphQL API driving scheduler matches.",
            img="../images/nurse.jpg",
            category="backend",
            tags="API, Service",
            frontendText="Lightweight client dashboard utilizing polling & web-sockets.",
            frontendTech="React 18",
            backendText="API microservice managing scheduling rules engines and nurse scheduling logic.",
            backendApi="GraphQL & REST",
            backendDb="PostgreSQL"
        ),
        Project(
            key="daoway-db",
            title="Daoway Database",
            desc="PostgreSQL schema modeling and transaction orchestration for service providers.",
            img="../images/daoway.jpg",
            category="backend",
            tags="Database, Modeling",
            frontendText="Internal analytics dashboard interface built on React components.",
            frontendTech="React, Chart.js",
            backendText="Highly indexed PostgreSQL schema featuring optimized CTEs and views for lightning fast search execution.",
            backendApi="GraphQL",
            backendDb="PostgreSQL"
        )
    ]

    for p in projects:
        db.add(p)
    db.commit()
    print("Database successfully seeded with project catalog!")

if __name__ == "__main__":
    seed()
