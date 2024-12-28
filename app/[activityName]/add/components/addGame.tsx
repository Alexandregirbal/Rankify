"use client";

import { HEADER_VARIABLES } from "@/app/constants";
import { ZodObjectId } from "@/database/utils";
import { calculateTeamsExpectations } from "@/modules/elo/expectations";
import { estimateBaseRating } from "@/modules/elo/ratings";
import { TeamScoring } from "@/modules/elo/types";
import { PlayerMongo } from "@/modules/player/types";
import { useActivityStore } from "@/stores/activity/provider";
import { useUIStore } from "@/stores/ui/provider";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import TextCircle from "./textCircle";

const DEFAULT_TEAM_SCORING: TeamScoring = {
  players: [],
  score: 0,
  eliminationFoul: "",
};

export default function AddGame({
  allPlayers,
  activityId,
}: {
  allPlayers: PlayerMongo[];
  activityId: ZodObjectId;
}) {
  const [team2, setTeam2] = useState<TeamScoring>(DEFAULT_TEAM_SCORING);
  const [team1, setTeam1] = useState<TeamScoring>(DEFAULT_TEAM_SCORING);
  const [teamRadioValue, setTeamRadioValue] = useState(true);

  const { isLoading, setIsLoading } = useUIStore((state) => state);
  const { selectedActivity } = useActivityStore((state) => state);
  const router = useRouter();

  const addPlayerTeam1Player = (player: PlayerMongo) => {
    setTeam1((oldState) => ({
      ...oldState,
      players: [...oldState.players, { ...player, playerId: player._id }],
    }));
  };

  const addPlayerTeam2Player = (player: PlayerMongo) => {
    setTeam2((oldState) => ({
      ...oldState,
      players: [...oldState.players, { ...player, playerId: player._id }],
    }));
  };

  const removeTeam1Player = (player: PlayerMongo) => {
    setTeam1((oldState) => {
      const { players } = oldState;

      const oldPlayerIndex = players.findIndex(
        (p) => p.playerId === player._id
      );
      if (oldPlayerIndex === -1) return oldState;

      const newPlayer = [...oldState.players];
      newPlayer.splice(oldPlayerIndex, 1);

      return { ...oldState, players: newPlayer };
    });
  };

  const removeTeam2Player = (player: PlayerMongo) => {
    setTeam2((oldState) => {
      const { players } = oldState;

      const oldPlayerIndex = players.findIndex(
        (p) => p.playerId === player._id
      );
      if (oldPlayerIndex === -1) return oldState;

      const newPlayer = [...oldState.players];
      newPlayer.splice(oldPlayerIndex, 1);

      return { ...oldState, players: newPlayer };
    });
  };

  const handleChangeTeam1Score = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTeam1({ ...team1, score: parseInt(value) });
  };

  const handleChangeTeam2Score = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTeam2({ ...team2, score: parseInt(value) });
  };

  const handleChangeEliminationFouls = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [eliminationFoulType, team] = name.split("-");

    if (team === "team1") {
      setTeam1({
        ...team1,
        score: 0,
        eliminationFoul: checked ? eliminationFoulType : "",
      });
      setTeam2({ ...team2, score: 1, eliminationFoul: "" });
    } else {
      setTeam2({
        ...team2,
        score: 0,
        eliminationFoul: checked ? eliminationFoulType : "",
      });
      setTeam1({ ...team1, score: 1, eliminationFoul: " " });
    }
  };

  const handleReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    setTeam1(DEFAULT_TEAM_SCORING);
    setTeam2(DEFAULT_TEAM_SCORING);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    fetch("/api/game", {
      method: "POST",
      headers: {
        [HEADER_VARIABLES.activityId]: activityId.toString(),
      },
      body: JSON.stringify({ team1, team2 }),
    })
      .then((res) => {
        if (res.status === 200) {
          router.push(`/${selectedActivity?.name}`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isSubmitDisabled = !(
    team1.score !== team2.score &&
    team1.players.length &&
    team2.players.length &&
    !isLoading
  );

  const expectations = calculateTeamsExpectations(team1.players, team2.players);
  const baseRating = estimateBaseRating(team1.players, team2.players);

  return (
    <div className="w-full flex flex-col items-center text-center gap-4">
      <h1 className="text-center text-2xl">Ajouter une partie</h1>
      <div className="flex flex-col gap-2 w-full">
        <div className="collapse bg-neutral collapse-arrow">
          <input
            type="radio"
            onClick={() => setTeamRadioValue(true)}
            name="my-accordion-2"
            defaultChecked
          />
          <div className="collapse-title text-xl font-medium flex flex-col gap-4">
            <>
              <div className="flex flex-row items-center gap-4">
                <TextCircle text="1" size="10" />
                <span>Players</span>
              </div>
              {!!team1.players.length &&
                !!team2.players.length &&
                !teamRadioValue && (
                  <div className="w-full flex flex-row justify-around">
                    <div className="flex flex-col gap-2">
                      <span className="text-base text-accent">Team 1</span>
                      <div className="flex flex-col gap-1">
                        {team1.players.map((player) => {
                          return (
                            <span key={player.userName} className="text-sm">
                              {player.userName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-base text-accent">Team 2</span>
                      <div className="flex flex-col gap-1">
                        {team2.players.map((player) => {
                          return (
                            <span key={player.userName} className="text-sm">
                              {player.userName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
            </>
          </div>
          <div className="collapse-content">
            <div className="w-full flex flex-row max-h-96 justify-between">
              <div className="flex flex-1 flex-col gap-2 overflow-y-scroll">
                {allPlayers.map((player, key) => {
                  const isSelected = team1.players.some(
                    (team1Player) => team1Player.playerId === player._id
                  );

                  return (
                    <div
                      key={key}
                      onClick={() =>
                        isSelected
                          ? removeTeam1Player(player)
                          : addPlayerTeam1Player(player)
                      }
                      className={`flex flex-col text-lg ${
                        isSelected ? "text-accent" : ""
                      }`}
                    >
                      {player.userName}
                    </div>
                  );
                })}
              </div>
              <div className="divider divider-horizontal">VS</div>
              <div className="flex flex-1 flex-col gap-2 overflow-y-scroll">
                {allPlayers.map((player, key) => {
                  const isSelected = team2.players.some(
                    (team2Player) => team2Player.playerId === player._id
                  );

                  return (
                    <div
                      key={key}
                      onClick={() =>
                        isSelected
                          ? removeTeam2Player(player)
                          : addPlayerTeam2Player(player)
                      }
                      className={`flex flex-col text-lg ${
                        isSelected ? "text-accent" : ""
                      }`}
                    >
                      {player.userName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="collapse bg-neutral collapse-arrow">
          <input
            type="radio"
            name="my-accordion-2"
            onClick={() => setTeamRadioValue(false)}
          />
          <div className="collapse-title text-xl font-medium flex flex-row items-center gap-4">
            <TextCircle text="2" size="10" />
            Results
          </div>
          <div className="collapse-content">
            <>
              <div
                className="tooltip w-full"
                data-tip={`Pourcentage de chances que l'équipe 1 gagne : ${(
                  (expectations?.team1 ?? 0.5) * 100
                ).toFixed(0)} %`}
              >
                <progress
                  className="progress progress-accent w-10/12"
                  value={(expectations?.team1 ?? 0.5) * 100}
                  max="100"
                />
              </div>
              <div className="collapse collapse-arrow  w-4/5 rounded-md">
                <input type="checkbox" />
                <div className="collapse-title font-medium">
                  🎱 - Elimination Fouls
                </div>

                <div className="collapse-content">
                  <div className="flex justify-between">
                    <div className="form-control flex justify-between flex-col items-center gap-4">
                      <label className="label cursor-pointer">
                        <span className="label-text mr-2">Black</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          name="black-team1"
                          checked={team1.eliminationFoul === "black"}
                          onChange={handleChangeEliminationFouls}
                        />
                      </label>
                    </div>

                    <div className="form-control flex flex-col items-center gap-4">
                      <label className="label cursor-pointer">
                        <span className="label-text mr-2">Black</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          name="black-team2"
                          checked={team2.eliminationFoul === "black"}
                          onChange={handleChangeEliminationFouls}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-evenly">
                <div className="flex flex-col items-center gap-4">
                  <span>Score team 1</span>
                  <input
                    className="input input-bordered w-1/2 focus:outline-accent"
                    type="number"
                    name="score"
                    value={team1.score}
                    onChange={handleChangeTeam1Score}
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <span>Score team 2</span>
                  <input
                    className="input input-bordered w-1/2 focus:outline-accent"
                    type="number"
                    name="score"
                    value={team2.score}
                    onChange={handleChangeTeam2Score}
                  />
                </div>
              </div>
            </>
          </div>
        </div>
        <div className="w-full flex flex-row justify-center items-center gap-4 my-2">
          <button className="btn btn-outline btn-error" onClick={handleReset}>
            Reset
          </button>

          <button
            disabled={isSubmitDisabled}
            className="btn btn-accent text-white"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
