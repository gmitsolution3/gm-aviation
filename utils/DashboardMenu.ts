export class DashboardMenu {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  defineUrl(url: string) {
    return url === "/" ? this.baseUrl : this.baseUrl.concat(url);
  }
}