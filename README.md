# Lens Algorithm Playground

This app showcases various Lens recommendation algorithms and APIs available in the Lens ecosystem.

## Supported APIs

- [Lens API](https://docs.lens.xyz/docs/introduction)
- [Karma3](https://karma3labs.com/)
- [MadFi](https://docs.madfinance.xyz/api/suggested-follows)
- [Airstack](https://docs.airstack.xyz/airstack-docs-and-faqs/reference/api-reference/socials-api/)

## Prerequisites

You so not need any credentials to run this app to interact with Lens or Karma3.

The APIs that require an API key are MadFi and Airstack.

You can get an Airstack API key by creating an account here.

You can request one for MadFi by reaching out to their team, you can learn more [here](https://app.airstack.xyz/)

## Running the app

To run this app, follow these steps:

1. Clone the repo

```sh
git clone git@github.com:dabit3/lens-algorithm-playground.git
```

2. Change into the directory and install the dependencies

```sh
cd lens-algorithm-playground

npm install # or yarn, pnpm
```

3. Run the app

```sh
npm start
```

4. (optional) To enable MadFi APIs

Set your API key in a file named `.env.local` (see `.example.env.local`)

```
MADFI_KEY=
```
