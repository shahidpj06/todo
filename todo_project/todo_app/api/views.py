import json
import requests
from .serializers import *
from github import Github
from todo_app.models import *
from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# class for obtaining JWT token with username - built in class from jwt
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


# View for obtaining JWT token with username    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# API view for listing available routes/urls
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)


# API view for creating user
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# API view for listing and creating projects
class ProjectListView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# API view for retrieving, updating, and deleting project details
class ProjectDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(self.queryset, id=self.kwargs.get('pk'), user=self.request.user)


# API view for retrieving, updating, and deleting todo details
class TodoDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        return get_object_or_404(project.todos, id=self.kwargs.get('todo_id'))


# API view for listing and creating todos for a project
class ProjectTodosView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        return project.todos.all()

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs.get('project_id'), user=self.request.user)
        serializer.save(project=project)


# API view for exporting summary of a project as a gist
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