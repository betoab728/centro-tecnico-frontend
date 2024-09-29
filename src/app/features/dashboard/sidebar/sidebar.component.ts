import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTachometerAlt  } from '@fortawesome/free-solid-svg-icons';
import { faUsers  } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList  } from '@fortawesome/free-solid-svg-icons';
import { faUserTie  } from '@fortawesome/free-solid-svg-icons';
import { faBriefcase  } from '@fortawesome/free-solid-svg-icons';
import { faUser  } from '@fortawesome/free-solid-svg-icons';
import { faChartBar  } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,FontAwesomeModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faClipboardList = faClipboardList;
  faUserTie = faUserTie;
  faBriefcase = faBriefcase;
  faUser = faUser;
  faChartBar = faChartBar;

}
