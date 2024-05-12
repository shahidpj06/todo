from django.contrib import admin
from .models import Todo,Project

@admin.register(Todo)
class TodAdmin(admin.ModelAdmin):
    list_display = [
        'task', 'status', 'created_date', 'updated_date', 'project'
    ]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'created_date'
    ]