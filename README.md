# Lens Algorithm Playground

This app showcases various Lens recommendation algorithms and APIs available in the Lens ecosystem.

## Supported APIs

- Lens API
- Karma3
- MadFi
- Airstack (soon)

## Prerequisites

You so not need any credentials to run this app. The only API that requires an API key is for MadFi. You can request one by reaching out to their team, you can learn more [here](https://docs.madfinance.xyz/)

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
