import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartData } from '../../services/websocket.service';
import jsPDF from 'jspdf';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() chartData!: ChartData;

  private chart?: Chart;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx || !this.chartData) return;

    const backgroundColors = this.generateColors(this.chartData.labels.length);

    this.chart = new Chart(ctx, {
      type: this.chartData.chartType,
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: this.chartData.title || '',
            data: this.chartData.data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            fill: this.chartData.chartType !== 'line',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: !!this.chartData.title,
            text: this.chartData.title,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}`,
            },
          },
          legend: {
            position: 'bottom',
            labels: {
              color: '#333',
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  }

  private generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  }

  exportAsImage(): void {
    const canvas = this.chartCanvas.nativeElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${this.chartData.title || 'chart'}.png`;
    link.click();
  }

  exportAsPDF(): void {
    const canvas = this.chartCanvas.nativeElement;
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height / canvas.width) * width;
    pdf.addImage(imageData, 'PNG', 10, 10, width - 20, height);
    pdf.save(`${this.chartData.title || 'chart'}.pdf`);
  }
}
