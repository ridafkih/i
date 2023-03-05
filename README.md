<div align="center">
  <h1>i</h2>
  <p>A simple microservice that serves you data about you.</p>
</div>

## 🤔 What is this for?

A _personal touch_ goes a long way in an online interactions, where things can feel disconnected or distant. This is meant to serve as a hub for personal data to which I can use to build personal interactions with on my projects.

## ❓ How does this work?

Through the Shortcuts application on my iOS device, and other on-hand physical device integrations such as smart watches, IoT devices, and more, I'm able to send data to this API to which it can be readily served on projects.

### Current iOS Shortcuts

You can install these on your own devices, and use this project as you please to build similar integrations. Most of these work well in automations which activate automatically, sans-prompt at sunrise, sunset, or at any point in the day.

- [Send Generalized Location](https://www.icloud.com/shortcuts/297e837bd951409f956fcc2e2a82e753)
  - This template will allow you to send an API request to the `/location` endpoint with the generalized location information of the device it is run on.

## 🔨 Configuration & Launch

### Prerequisites

- Docker
- NodeJS
- yarn

### Configuration

First start off by cloning this repository.

```bash
git clone git@github.com:ridafkih/i.git
```

After that, navigate into the directory and install dependencies.

```bash
cd i
yarn
```

Once that's done, setup your `.env` file in the root directory according to the adjacent `.env.example` file.

### Launch

Launching the project locally is easy, using Docker, Prisma, and NodeJS.

Start off by launching the database, and preparing the data schema. Make sure you have the Docker engine running for this part.

```bash
yarn database:up
yarn prisma:mix
```

Once that's done, run the data migrations.

```bash
yarn prisma:migrate:dev
```

Finally, you can run the microservice itself.

```bash
yarn dev
```

This will watch the directory for changes, so you can iterate quickly.
