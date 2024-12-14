import { ObjectId } from "mongodb";

export const MOCK_GAMES = [
  {
    _id: new ObjectId("66fd3cdb42d4c012ac8621f6"),
    team1: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 1,
        rating: 1000,
        newRating: 1028,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cce42d4c012ac8621ed"),
        userName: "Jean",
        games: 1,
        rating: 1000,
        newRating: 972,
      },
    ],
    scores: [8, 0],
    winner: "1",
    createdAt: new Date("2024-10-02T12:30:19.741Z"),
    updatedAt: new Date("2024-10-02T12:30:19.741Z"),
  },
  {
    _id: new ObjectId("66fd3cf442d4c012ac862210"),
    team1: [
      {
        playerId: new ObjectId("66fd3cbd42d4c012ac8621de"),
        userName: "Simon",
        games: 1,
        rating: 1000,
        newRating: 1011,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 2,
        rating: 1028,
        newRating: 1017,
      },
    ],
    eliminationFoul: "black",
    scores: [1, 0],
    winner: "1",
    createdAt: new Date("2024-10-02T12:30:44.891Z"),
    updatedAt: new Date("2024-10-02T12:30:44.891Z"),
  },
  {
    _id: new ObjectId("66fe65593ee911e6f10b6287"),
    team1: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 3,
        rating: 1017,
        newRating: 1042,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cce42d4c012ac8621ed"),
        userName: "Jean",
        games: 2,
        rating: 972,
        newRating: 947,
      },
    ],
    scores: [8, 0],
    winner: "1",
    createdAt: new Date("2024-10-03T09:35:21.319Z"),
    updatedAt: new Date("2024-10-03T09:35:21.319Z"),
  },
  {
    _id: new ObjectId("66fe65623ee911e6f10b6294"),
    team1: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 4,
        rating: 1042,
        newRating: 1063,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cce42d4c012ac8621ed"),
        userName: "Jean",
        games: 3,
        rating: 947,
        newRating: 926,
      },
    ],
    scores: [8, 0],
    winner: "1",
    createdAt: new Date("2024-10-03T09:35:30.745Z"),
    updatedAt: new Date("2024-10-03T09:35:30.745Z"),
  },
  {
    _id: new ObjectId("66fe69b53ee911e6f10b6313"),
    team1: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 5,
        rating: 1063,
        newRating: 1089,
      },
      {
        playerId: new ObjectId("66fd3cc942d4c012ac8621e8"),
        userName: "Fabien",
        games: 1,
        rating: 1000,
        newRating: 1026,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cc642d4c012ac8621e3"),
        userName: "Rémi",
        games: 1,
        rating: 1000,
        newRating: 974,
      },
    ],
    scores: [8, 0],
    winner: "1",
    createdAt: new Date("2024-10-03T09:53:57.465Z"),
    updatedAt: new Date("2024-10-03T09:53:57.465Z"),
  },
  {
    _id: new ObjectId("66fe69e03ee911e6f10b634e"),
    team1: [
      {
        playerId: new ObjectId("66fd3cbd42d4c012ac8621de"),
        userName: "Simon",
        games: 2,
        rating: 1011,
        newRating: 1045,
      },
      {
        playerId: new ObjectId("66fd3cc642d4c012ac8621e3"),
        userName: "Rémi",
        games: 2,
        rating: 974,
        newRating: 1008,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 6,
        rating: 1089,
        newRating: 1055,
      },
      {
        playerId: new ObjectId("66fd3cc942d4c012ac8621e8"),
        userName: "Fabien",
        games: 2,
        rating: 1026,
        newRating: 992,
      },
    ],
    scores: [8, 0],
    winner: "1",
    createdAt: new Date("2024-10-03T09:54:40.387Z"),
    updatedAt: new Date("2024-10-03T09:54:40.387Z"),
  },
  {
    _id: new ObjectId("66fe6a033ee911e6f10b637f"),
    team1: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 7,
        rating: 1055,
        newRating: 1065,
      },
      {
        playerId: new ObjectId("66fd3cc942d4c012ac8621e8"),
        userName: "Fabien",
        games: 3,
        rating: 992,
        newRating: 1002,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cbd42d4c012ac8621de"),
        userName: "Simon",
        games: 3,
        rating: 1045,
        newRating: 1035,
      },
      {
        playerId: new ObjectId("66fd3cc642d4c012ac8621e3"),
        userName: "Rémi",
        games: 3,
        rating: 1008,
        newRating: 998,
      },
    ],
    scores: [8, 7],
    winner: "1",
    createdAt: new Date("2024-10-03T09:55:15.138Z"),
    updatedAt: new Date("2024-10-03T09:55:15.138Z"),
  },
  {
    _id: new ObjectId("66fe6baa3ee911e6f10b63fa"),
    team1: [
      {
        playerId: new ObjectId("66fd3cba42d4c012ac8621d9"),
        userName: "Clément",
        games: 8,
        rating: 1065,
        newRating: 1092,
      },
      {
        playerId: new ObjectId("66fd3cc942d4c012ac8621e8"),
        userName: "Fabien",
        games: 4,
        rating: 1002,
        newRating: 1029,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cbd42d4c012ac8621de"),
        userName: "Simon",
        games: 4,
        rating: 1035,
        newRating: 1008,
      },
      {
        playerId: new ObjectId("66fd3cc642d4c012ac8621e3"),
        userName: "Rémi",
        games: 4,
        rating: 998,
        newRating: 971,
      },
    ],
    scores: [8, 0],
    winner: "1",
    createdAt: new Date("2024-10-03T10:02:18.639Z"),
    updatedAt: new Date("2024-10-03T10:02:18.639Z"),
  },
  {
    _id: new ObjectId("66fe8b0f3ee911e6f10b6432"),
    team1: [
      {
        playerId: new ObjectId("66fd3cce42d4c012ac8621ed"),
        userName: "Jean",
        games: 4,
        rating: 926,
        newRating: 939,
      },
    ],
    team2: [
      {
        playerId: new ObjectId("66fd3cc942d4c012ac8621e8"),
        userName: "Fabien",
        games: 5,
        rating: 1029,
        newRating: 1016,
      },
    ],
    eliminationFoul: "black",
    scores: [1, 0],
    winner: "1",
    createdAt: new Date("2024-10-03T12:16:15.878Z"),
    updatedAt: new Date("2024-10-03T12:16:15.878Z"),
  },
];
