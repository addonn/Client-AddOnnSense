import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';


@Component({
  selector: 'app-floor-map',
  standalone: true,
  templateUrl: './floor-map.component.html',
  styleUrls: ['./floor-map.component.scss']
})
export class FloorMapComponent implements AfterViewInit, OnDestroy {
  @Input() floorGeoJson!: any;
  @Input() mapId!: string;

  private map!: L.Map;

  

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0); // Wait for DOM to be ready
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Clean up
    }
  }

  initMap(): void {
    // Fix marker icons (optional, if you use markers)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });
    const mapElement = document.getElementById(this.mapId);
    if (!mapElement || !this.floorGeoJson) {
      console.warn('Map element or GeoJSON missing');
      return;
    }

    this.map = L.map(mapElement, {
      center: [0, 0],
      zoom: 1,
      zoomControl: true
    });

    const geoLayer = L.geoJSON(this.floorGeoJson, {
      style: {
        color: '#007bff',
        fillColor: '#cce5ff',
        weight: 1,
        fillOpacity: 0.5
      },
      onEachFeature: (feature, layer) => {
        const label = feature.properties?.name || feature.properties?.label || '';
        if (label) {
          layer.bindTooltip(label, { permanent: true, direction: 'center', className: 'floor-label' });
        }
      }
    }).addTo(this.map);

    this.map.fitBounds(geoLayer.getBounds());
  }
}
