#version 330

uniform mat4 MVP;
uniform mat4 matrix_ModelView;
uniform mat3 matrix_Normal;

uniform vec4 lightDir_cam;

layout (location = 0) in vec4 vertPos_mSpace;
layout (location = 1) in vec3 vertNorm_mSpace;
layout (location = 2) in vec2 vertUV_mSpace;


out Data
{
  vec3 normal;
  vec3 eye;
  vec3 lightDir;
  vec2 texUV;
} DataOut;

void main()
{
  vec4 pos = matrix_ModelView * vertPos_mSpace;

  DataOut.normal = normalize(matrix_Normal * vertNorm_mSpace);
  DataOut.lightDir = vec3(lightDir_cam - pos);
  DataOut.eye = vec3(-pos);
  DataOut.texUV = vec2(vertUV_mSpace.x, 1.0 - vertUV_mSpace.y);

  gl_Position = MVP * vertPos_mSpace;
}