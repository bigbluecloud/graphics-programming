#version 330

uniform vec4 matDiffuse;
uniform vec4 matAmbient;
uniform vec4 matSpecular;
uniform float matShininess;

uniform sampler2D texUnit;
uniform sampler2D normUnit;

in Data
{
  vec3 normal;
  vec3 eye;
  vec3 lightDir;
  vec2 texUV;
} DataIn;

out vec4 outColour;

void main()
{
  vec4 specular = vec4(0.0);
  
  vec3 n = normalize(DataIn.normal);
  vec3 l = normalize(DataIn.lightDir);
  vec3 e = normalize(DataIn.eye);

  vec3 normMapVal = 2.0 * texture2D(normUnit, DataIn.texUV).rgb - 1.0;
  if(normMapVal != vec3(-1.0, -1.0, -1.0))
    n = normalize(normMapVal);

  float intensity = max(dot(n, l), 0.0);
  
  if(intensity > 0.0)
  {
    vec3 halfNorm = normalize(l + e);
    float specTerm = max(dot(halfNorm, n), 0.0);
    specular = matSpecular * pow(specTerm, matShininess);
  }

  vec4 texColour = texture(texUnit, DataIn.texUV);
  vec4 diffColour = intensity * matDiffuse * texColour;
  
  if(texColour.a == 0.0)
    discard;

  if(diffColour != vec4(0.0,0.0,0.0,0.0))
  {
    vec4 ambColour = matAmbient * texColour;
    outColour = max(diffColour + specular, ambColour);
  }
  else
    outColour = max(intensity * matDiffuse + specular, matAmbient);
}