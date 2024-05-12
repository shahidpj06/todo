from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, logout
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import json
from todo_app.models import Project, Todo
from .serializers import *



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)


class ProjectListView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(self.queryset, id=self.kwargs.get('pk'), user=self.request.user)

class TodoDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        return get_object_or_404(project.todos, id=self.kwargs.get('todo_id'))

class ProjectTodosView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        return project.todos.all()

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        serializer.save(project=project)

class ExportSummaryView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        total_todos = project.todos.count()
        completed_todos = project.todos.filter(status=True).count()
        markdown_content = f"# {project.title}\n\nSummary: {completed_todos}/{total_todos} completed.\n\n"
        markdown_content += "## Pending Todos:\n"
        pending_todos = project.todos.filter(status=False)
        for todo in pending_todos:
            markdown_content += f"- [ ] {todo.task}\n"
        markdown_content += "\n## Completed Todos:\n"
        completed_todos = project.todos.filter(status=True)
        for todo in completed_todos:
            markdown_content += f"- [x] {todo.task}\n"

        github_api_url = 'https://api.github.com/gists'
        headers = {'Authorization': 'token YOUR_GITHUB_TOKEN'}
        payload = {
            'description': f'{project.title} Summary',
            'public': False,
            'files': {
                f'{project.title}.md': {'content': markdown_content}
            }
        }
        response = requests.post(github_api_url, headers=headers, data=json.dumps(payload))
        if response.status_code == 201:
            gist_url = response.json()['html_url']
            return Response({'message': 'Summary exported successfully', 'gist_url': gist_url})
        else:
            return Response({'error': 'Failed to export summary'}, status=response.status_code)