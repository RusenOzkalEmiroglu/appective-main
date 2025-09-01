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
  },
  {
    "title": "ıeüeaüt",
    "description": "iaiüiüaiü",
    "image": "/uploads/bdd27c4e-5537-4432-bd0b-91fef4854e71.png",
    "features": [
      "aiaüiü"
    ],
    "platforms": "Coming Soon",
    "projectUrl": "https://www.parakulis.com",
    "id": 2
  }
];
