# RepRecorder.Api

An API for managing wieght-lifting workout reps

## Requirements

- .NET 10
- Node 24+ (React 19.2.4)

## Setup

```sh
git clone git@github.com:wizzard262/rep-recorder.git 
cd rep-recorder
code .
```

### API

Run API
```sh
dotnet restore
dotnet tool restore
cd RepRecorder.Api
dotnet run
```

Run tests

`dotnet test`

Run mutation tests

`dotnet stryker`


### UI (in VS Code Terminal, not Powershell)

```sh
cd rep-recorder-ui
npm i
npm run dev
```

## ============= OTHER ===================
REDUX = state management

