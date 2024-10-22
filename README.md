# MoveOut Web Application

MoveOut is a website made with NextJS
together with Mantine (UI),
Prisma (DB ORM), Neon (DB storage), Resend(email handler), Jest (testing) to make keeping track of content in moving boxes easier!

## Prerequisites
### Software
- node \>v16.8.0
- npm \>v7.21.0

### Accounts
- Access to S3 Bucket account
- Access to Neon account
- Access to Resend account

## Usage

### Environment variables
Create new .env file using .env.example and
fill in the blanks

### Build

```
npm install
npx prisma generate
npx prisma migrate deploy
```

### Run build server:

```
npm run build
npm run start
```

### Run development server:

```
npm run dev
```

### Run tests
```
npm run test
```

### Run linter
```
npm run lint
```

## License
MIT License (LICENSE.txt)