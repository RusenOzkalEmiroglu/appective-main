export interface GameItem {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
  platforms: string;
  projectUrl?: string;
}

export const initialGames: GameItem[] = [
  {
    "title": "Findoo",
    "description": "A fun guessing game.",
    "image": "/images/interactive-mastheads/games/2--tahmin/preview-86d884dd4714e49f.png",
    "features": [
      "Number Guessing",
      "Score Tracking",
      "Leaderboard"
    ],
    "platforms": "Coming Soon",
    "projectUrl": "https://appective.net",
    "id": 1
  }
];
