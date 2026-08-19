# Architecture

The planned flow is **React frontend -> Express API -> eligibility engine -> verified scheme database -> provider-independent AI service**. AI output must be grounded in scheme records from verified sources; it must not invent schemes. Client API calls live in `client/src/services`, while server business logic belongs in services and controllers.
