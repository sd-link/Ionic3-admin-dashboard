import { ModalConfirmDeletePageModule } from '../pages/modal-confirm-delete/modal-confirm-delete.module';
import { ContentAddMemberPageModule } from '../pages/content-add-member/content-add-member.module';
import { ModalCronjobsPageModule } from '../pages/modal-cronjobs/modal-cronjobs.module';
import { ComponentsModule } from '../components/components.module';
import { UserSubscriptionPageModule } from '../pages/user-subscription/user-subscription.module';
import { UserInvoicesPageModule } from '../pages/user-invoices/user-invoices.module';
import { UserChangePasswordPageModule } from '../pages/user-change-password/user-change-password.module';
import { LoginPageModule } from '../pages/login/login.module';
import { CookieService } from 'ng2-cookies';
import { NavController } from 'ionic-angular';
import { Endpoint } from '../services/endpoints';
import { UserService } from '../services/user.service';
import { HttpSerializer } from '../services/http-serializer.service';
import { MyApp } from './app.component';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { CreateProjectPageModule } from '../pages/project-create/create-project.module';
import { ProjectListPageModule } from '../pages/project-list/project-list.module';
import { ModalWorkersPageModule } from "../pages/modal-workers/modal-workers.module";
export var PROVIDERS = [
    CookieService,
    UserService,
    NavController,
    Endpoint,
    HttpSerializer
];
export var MODULES = [
    EditProfilePageModule,
    CreateProjectPageModule,
    ProjectListPageModule,
    LoginPageModule,
    UserChangePasswordPageModule,
    UserInvoicesPageModule,
    UserSubscriptionPageModule,
    ComponentsModule,
    ModalWorkersPageModule,
    ModalCronjobsPageModule,
    ModalConfirmDeletePageModule,
    ContentAddMemberPageModule
];
export var COMPONENTS = [
    MyApp
];
//# sourceMappingURL=app.imports.js.map