from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
import os

load_dotenv()

@api_view(['GET'])
def TestView(request):
    return Response({ 'response': str(os.getenv("OPENAI_API_KEY")) })