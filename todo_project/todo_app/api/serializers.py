from rest_framework import serializers
from todo_app.models import Todo, Project

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'task', 'status', 'project', 'created_date', 'updated_date']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'created_date']
