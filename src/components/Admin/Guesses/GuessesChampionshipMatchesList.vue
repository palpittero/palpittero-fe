<script setup lang="ts">
import type { iGuess } from '@/types'

const props = defineProps<{
  guesses: iGuess[]
}>()
</script>

<template>
  <ul class="list bg-base-100 rounded-box shadow-md">
    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>

    <li class="list-row">
      <div>
        <img
          class="size-10 rounded-box"
          src="https://img.daisyui.com/images/profile/demo/1@94.webp"
        />
      </div>
      <div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <img
                v-if="match.homeTeam?.badge"
                :src="match.homeTeam?.badge"
                class="w-6 h-6 rounded-box"
              />
              <span :class="homeTeamRegularTimeScoreClass">{{ match.homeTeam?.name }}</span>
            </div>
            <span :class="homeTeamRegularTimeScoreClass">
              {{ parseMatchGoals(match.regularTimeHomeTeamGoals) }}
            </span>
            <span v-if="isPenaltiesRound" :class="homeTeamPenaltiesTimeScoreClass">
              ({{ parseMatchGoals(match.penaltiesTimeHomeTeamGoals) }})
            </span>
          </div>
          <div v-if="match.awayTeam" class="flex items-center justify-around gap-2">
            <div class="flex items-center gap-2 w-full">
              <img
                v-if="match.awayTeam.badge"
                :src="match.awayTeam.badge"
                class="w-6 h-6 rounded-box"
              />
              <span :class="awayTeamRegularTimeScoreClass">
                {{ match.awayTeam.name }}
              </span>
            </div>
            <span :class="awayTeamRegularTimeScoreClass">
              {{ parseMatchGoals(match.regularTimeAwayTeamGoals) }}
            </span>
            <span v-if="isPenaltiesRound" :class="awayTeamPenaltiesTimeScoreClass">
              ({{ parseMatchGoals(match.penaltiesTimeAwayTeamGoals) }})
            </span>
          </div>
        </div>
      </div>
      <button class="btn btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 3L20 12 6 21 6 3z"></path>
          </g>
        </svg>
      </button>
      <button class="btn btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            ></path>
          </g>
        </svg>
      </button>
    </li>

    <li class="list-row">
      <div>
        <img
          class="size-10 rounded-box"
          src="https://img.daisyui.com/images/profile/demo/4@94.webp"
        />
      </div>
      <div>
        <div>Ellie Beilish</div>
        <div class="text-xs uppercase font-semibold opacity-60">Bears of a fever</div>
      </div>
      <button class="btn btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 3L20 12 6 21 6 3z"></path>
          </g>
        </svg>
      </button>
      <button class="btn btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            ></path>
          </g>
        </svg>
      </button>
    </li>

    <li class="list-row">
      <div>
        <img
          class="size-10 rounded-box"
          src="https://img.daisyui.com/images/profile/demo/3@94.webp"
        />
      </div>
      <div>
        <div>Sabrino Gardener</div>
        <div class="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
      </div>
      <button class="btn btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 3L20 12 6 21 6 3z"></path>
          </g>
        </svg>
      </button>
      <button class="btn btn-square btn-ghost">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            ></path>
          </g>
        </svg>
      </button>
    </li>
  </ul>
</template>
