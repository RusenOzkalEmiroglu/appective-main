export interface MastheadItem {
  id: string;
  category: string;
  brand: string;
  title: string;
  image: string;
  popupHtmlPath: string;
  popupTitle: string;
  popupDescription: string;
  bannerDetails: {
    size: string;
    platforms: string;
  };
}
