export interface ChartData {
    datasets: {
      name: string,
      color: string,
      data: { x: number, y: number }[]
    }[],
  }
  