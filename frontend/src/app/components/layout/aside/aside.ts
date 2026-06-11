import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './aside.html',
  styleUrls: ['./aside.css']
})
export class Aside {
  // Control de estado de cada sección
  clientsOpen = false;
  propertiesOpen = false;
  contractsOpen = false;

  toggleClients() {
    this.clientsOpen = !this.clientsOpen;
  }

  toggleProperties() {
    this.propertiesOpen = !this.propertiesOpen;
  }

  toggleContracts() {
    this.contractsOpen = !this.contractsOpen;
  }
  ownersOpen = false;

toggleOwners(): void {
  this.ownersOpen = !this.ownersOpen;
}
propertyTypesOpen = false;

togglePropertyTypes(): void {
  this.propertyTypesOpen = !this.propertyTypesOpen;
}

amenitiesOpen = false;

toggleAmenities(): void {
  this.amenitiesOpen = !this.amenitiesOpen;
}

paymentsOpen = false;

togglePayments(): void {
  this.paymentsOpen = !this.paymentsOpen;
}

visitsOpen = false;

toggleVisits(): void {
  this.visitsOpen = !this.visitsOpen;
}

evaluationsOpen = false;

toggleEvaluations(): void {
  this.evaluationsOpen = !this.evaluationsOpen;
}

}