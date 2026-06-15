import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent as NgxMapComponent, MarkerComponent } from 'ngx-mapbox-gl';
import { ClickTrackerDirective } from '../../shared/click-tracker.directive';
import { CartItem } from '../../state/click-tracker.actions';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  coordinates: [number, number]; // [lng, lat]
  menu: { id: string; name: string; price: number }[];
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, NgxMapComponent, MarkerComponent, ClickTrackerDirective],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class AppMapComponent {
  @Output() itemAdded = new EventEmitter<CartItem>();

  // Place your Mapbox Access Token here
  accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
  mapStyle = 'mapbox://styles/mapbox/streets-v11';
  center: [number, number] = [-73.985664, 40.748440]; // New York
  zoom: [number] = [13.5];

  restaurants: Restaurant[] = [
    {
      id: 'pizza-1',
      name: 'Pizzería Bella',
      cuisine: 'Italiana 🍕',
      coordinates: [-73.985664, 40.748440],
      menu: [
        { id: 'p-1', name: 'Pizza Margherita', price: 12.99 },
        { id: 'p-2', name: 'Focaccia con Ajo', price: 5.49 }
      ]
    },
    {
      id: 'burger-1',
      name: 'Burger Joint',
      cuisine: 'Americana 🍔',
      coordinates: [-73.990000, 40.750000],
      menu: [
        { id: 'b-1', name: 'Hamburguesa Clásica', price: 10.99 },
        { id: 'b-2', name: 'Papas Fritas Crujientes', price: 3.99 }
      ]
    },
    {
      id: 'sushi-1',
      name: 'Sushi Zen',
      cuisine: 'Japonesa 🍣',
      coordinates: [-73.980000, 40.745000],
      menu: [
        { id: 's-1', name: 'Maki de Salmón', price: 14.49 },
        { id: 's-2', name: 'Sopa Miso', price: 3.49 }
      ]
    }
  ];

  selectedRestaurant: Restaurant | null = null;

  selectRestaurant(restaurant: Restaurant): void {
    this.selectedRestaurant = restaurant;
  }

  addDish(restaurant: Restaurant, dish: { id: string; name: string; price: number }): void {
    this.itemAdded.emit({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    });
  }
}
