# Rankify

Open source ranking app for diverse activities like pool, fussball, table tennis, etc.

## Development

### Requirements

- Node.js >=18.x
- MongoDB >=7.x

### Running the development server

First, update the `.env.local` file with your MongoDB URI.

To run the development server:

```bash
npm run dev
```

Before creating a pull request, make sure to run the tests:

```bash
npm run test
```

And to test your changes with the production server (important with NextJS):

```bash
npm run build && npm run start
```

### Guidelines

Juste keep it clear and simple. KISS.

### Stack
- NextJS 14 with Page router
- MongoDB
  - Drizzle (coming soon)
- Zod (coming soon)
- Vitest
- Tailwind CSS
  - DaisyUI (for the design simplicity)

### Deployment

Pushing to the `main` branch will trigger a deployment to Vercel.

## Elo rating system

In order to keep a fair ranking, I implemented an Elo rating system.
I built something new inspired by [this article](https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53), which I adapted to an unlimited number of players in each team. If you want to understand why this ranking system is reliable, you can watch [this video](https://www.youtube.com/watch?v=9oRDksmH0zM).

All of the elo implementation is in the `elo` module. Unit tests are also there to ensure the correctness of the implementation.

The `elo` module is following these rules:

- Players start with a rating of **1000** (DEFAULT_RATING)

- A difference of **400** (THRESHOLD) points between two players means that the weakest player as 1 out of **10** (POWER) chances to win the game.

- The new rating of a player is calculated as follows. With

  - $R_{new}$ the new rating of the player
  - $R_{old}$ the formed rating of the player
  - $P$ the P-Factor
  - $K$ the K-Factor
  - $S_{p}$ the score of the player: 1 for win, 0 for loss
  - $E_p$ the winning expectation of the player against its opponent

  > $ R_{new} = R_{old} + K \cdot P \cdot (S_{p} - E_{p}) $


### Factors
- The newer the player, the higher the **KFactor**. K starts at 40 and tends to 20 as the player plays more games. With:
  - $K$ the K-Factor
  - $x$ the number of games played

  > $ K = 20 \cdot(1 + \frac{1}{1+\frac{x}{10}}) $

  ![K-Factor](assets/k-factor.png)

- A big difference in game scores will increase the **PFactor**. It starts at 1 and grows slowly. For example: a scrore of 8-0 will result in a PFactor of 2.83 while a score of 8-7 will result in a PFactor of 1. With:
  - $P$ the PFactor
  - $s1$ the score of player 1 
  - $s2$ the score of player 2
  
  > $ P = \sqrt{|s1 - s2|} $

  ![PFactor](assets/p-factor.png)

### 1 vs 1 situation
- The expectation of a player is calculated based on its rating and the rating of its opponent. It represents the probability of winning against the opponent.
 With:
    - $E_{p1}$ the expectation of player 1
    - $E_{p2}$ the expectation of player 2
    - $R_1$ player 1 rating
    - $R_2$ player 2 rating

    > $E_{p1} = \frac{1}{1 + 10^{\frac{R_2 - R_1}{400}}}$

    > $E_{p2} = \frac{1}{1 + 10^{\frac{R_1 - R_2}{400}}}$

### Team A vs Team B situation 
- The expectation of a team is calculated based on the average rating of the players in the team. Otherwise it follows the same rules as the 1 vs 1 situation.
  With:
    - $R_tA$ the average rating of team A
    - $R_tB$ the average rating of team B
    - $r_in$ the ratings of the players of team A and `n` the number of players in team A:
    - $r_jm$ the ratings of the players of team B and `m` the number of players in team B:

    > $ R_{tA} = \frac{r_1 ... r_i ... r_n}{n} $
  
    > $ R_{tB} = \frac{r_1 ... r_j ... r_m}{m} $

  The Expectation is calculated as follows, with:

    - $E_{tA}$ the expectation of team A
    - $E_{tB}$ the expectation of team B

    > $E_{tA} = \frac{1}{1 + 10^{\frac{R_tB - R_tA}{400}}}$

    > $E_{tB} = \frac{1}{1 + 10^{\frac{R_tA - R_tB}{400}}}$

### Examples:
- Team A has two players with ratings of: 1000 and 2000
- Team B has two players with ratings of: 900 and 1300

- Let's imagine that team A wins against team B.

- For simplicity, let's take a value of 1 for P and 10 for K.

  $R_{tA} = \frac{1000 + 2000}{2} = 1500$

  $R_{tB} = \frac{900 + 1300}{2} = 1100$

  $E_{tA} = \frac{1}{1 + 10^{\frac{1100 - 1500}{400}}} = 0.9$

  $E_{tB} = \frac{1}{1 + 10^{\frac{1500 - 1100}{400}}} = 0.1$


- Let's imagine that team B wins against team A.

  > $R_{new-tA1} \newline = R_{old-tA1} + K \cdot P \cdot (1 - E_{tA}) \newline = 1000 + 10 \cdot 1 \cdot (0 - 0.9) \newline = 1000 - 9 = 991$

  > $R_{new-tA2} \newline = R_{old-tA2} + K \cdot P \cdot (1 - E_{tA}) \newline = 2000 + 10 \cdot 1 \cdot (0 - 0.9) \newline = 2000 - 9 \newline = 1991$

  > $R_{new-tB1} \newline = R_{old-tB1} + K \cdot P \cdot (1 - E_{tB}) \newline = 900 + 10 \cdot 1 \cdot (1 - 0.1) \newline = 900 + 9 \newline = 909$

  > $R_{new-tB2} \newline = R_{old-tB2} + K \cdot P \cdot (1 - E_{tB}) \newline = 1300 + 10 \cdot 1 \cdot (1 - 0.1) \newline = 1300 + 9 \newline = 1309$

- Let's imagine that team A wins against team B.

  > $R_{new-tA1} \newline = R_{old-tA1} + K \cdot P \cdot (1 - E_{tA}) \newline = 1000 + 10 \cdot 1 \cdot (1 - 0.9) \newline = 1000 +1 \newline = 1001$

  > $R_{new-tA2} \newline = R_{old-tA2} + K \cdot P \cdot (1 - E_{tA}) \newline = 2000 + 10 \cdot 1 \cdot (1 - 0.9) \newline = 2000 + 1 \newline = 2001$

  > $R_{new-tB1} \newline = R_{old-tB1} + K \cdot P \cdot (1 - E_{tB}) \newline = 900 + 10 \cdot 1 \cdot (0 - 0.1) \newline = 900 - 1 \newline = 899$

  > $R_{new-tB2} \newline = R_{old-tB2} + K \cdot P \cdot (1 - E_{tB}) \newline = 1300 + 10 \cdot 1 \cdot (0 - 0.1) \newline = 1300 - 1 \newline = 1299$

**Conclusion**: the rewards are higher if the weakest team wins.  