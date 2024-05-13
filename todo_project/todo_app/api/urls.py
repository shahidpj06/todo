from django.urls import path
from . import views
from . views import MyTokenObtainPairView, UserCreateView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', views.getRoutes),
    path('users/', UserCreateView.as_view(), name='user-create'),
    path('projects/', views.ProjectListView.as_view(), name='project-list'),
    path('projects/<int:pk>/', views.ProjectDetailsView.as_view(), name='project-detail'),
    path('projects/<int:project_id>/todos/', views.ProjectTodosView.as_view(), name='project-todos'),
    path('projects/<int:project_id>/todos/<int:todo_id>/', views.TodoDetailsView.as_view(), name='todo-detail'),
    path('projects/<int:project_id>/export-summary/', views.ExportSummaryView.as_view(), name='export-summary'),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]