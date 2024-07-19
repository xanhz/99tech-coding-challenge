# Env setup

- Rename `.env.example` to `.env` for production or `.env.dev` for development
- Fill env values

# Installation

```bash
# Install dependencies
yarn install

# Generate migration (go to your database and create one before running command below)
yarn prisma migrate deploy

# Generate sample data
yarn seed:book

# Run app
yarn start
```

# API document

You can go to Postman and try APIs by [this link](https://www.postman.com/cloudy-resonance-641660/workspace/99tech-problem-5/collection/22835738-120dce14-bdfd-43ec-91c1-b7b57162fa14?action=share&creator=22835738)
