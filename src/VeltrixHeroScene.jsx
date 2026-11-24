import React,{useEffect,useMemo,useState} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import './VeltrixHeroScene.css';

function hasWebGL(){
  try{
    const canvas=document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext&&(canvas.getContext('webgl2')||canvas.getContext('webgl')||canvas.getContext('experimental-webgl')));
  }catch{return false;}
}

function Orb({mobile}){
  const group=React.useRef();
  const material=React.useRef();
  useFrame((state,delta)=>{
    if(!group.current)return;
    const targetX=state.pointer.y*.2;
    const targetY=state.pointer.x*.28;
    group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,targetX,2.2,delta);
    group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,targetY+state.clock.elapsedTime*.075,2.2,delta);
    group.current.position.y=Math.sin(state.clock.elapsedTime*.65)*.075;
    if(material.current)material.current.uniforms.uTime.value=state.clock.elapsedTime;
  });
  const uniforms=useMemo(()=>({uTime:{value:0},uColorA:{value:new THREE.Color('#d9e8c8')},uColorB:{value:new THREE.Color('#557b5a')}}),[]);
  return <group ref={group}>
    <mesh scale={mobile?1.28:1.55}>
      <icosahedronGeometry args={[1, mobile?5:7]}/>
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent/>
    </mesh>
    <mesh rotation={[.85,.35,-.45]} scale={mobile?1.62:1.92}>
      <torusGeometry args={[1,.009,8,mobile?100:180]}/>
      <meshBasicMaterial color="#a7c48b" transparent opacity={.68}/>
    </mesh>
    <mesh rotation={[-.65,-.5,.5]} scale={mobile?1.78:2.08}>
      <torusGeometry args={[1,.006,8,mobile?100:180]}/>
      <meshBasicMaterial color="#6e916d" transparent opacity={.38}/>
    </mesh>
    <mesh rotation={[1.2,.2,.1]} scale={mobile?1.48:1.72}>
      <torusGeometry args={[1,.004,8,mobile?90:160]}/>
      <meshBasicMaterial color="#f4f6e9" transparent opacity={.75}/>
    </mesh>
  </group>;
}

const vertexShader=`varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
void main(){
  vUv=uv;
  vec3 transformed=position;
  float wave=sin(position.y*5.0+position.x*3.0)*0.018;
  transformed+=normal*wave;
  vNormal=normalize(normalMatrix*normal);
  vPosition=(modelViewMatrix*vec4(transformed,1.0)).xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.0);
}`;

const fragmentShader=`uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
void main(){
  vec3 n=normalize(vNormal);
  vec3 viewDir=normalize(-vPosition);
  float fresnel=pow(1.0-max(dot(n,viewDir),0.0),2.35);
  float flow=noise(vUv*5.0+vec2(uTime*.075,-uTime*.045));
  float bands=sin(vUv.y*17.0+flow*5.0+uTime*.22)*.5+.5;
  vec3 base=mix(uColorA,uColorB,smoothstep(.05,.95,vUv.y+flow*.2));
  vec3 color=mix(base,vec3(.91,.96,.82),fresnel*.92);
  color+=vec3(.35,.49,.3)*bands*.12;
  color+=vec3(.72,.84,.62)*pow(fresnel,2.0)*.5;
  float alpha=.62+fresnel*.36;
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function ParticleField({mobile}){
  const points=React.useRef();
  const count=mobile?260:900;
  const positions=useMemo(()=>{
    const values=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const radius=2.1+Math.random()*2.8;
      const theta=Math.random()*Math.PI*2;
      const phi=Math.acos(2*Math.random()-1);
      values[i*3]=radius*Math.sin(phi)*Math.cos(theta);
      values[i*3+1]=radius*Math.sin(phi)*Math.sin(theta);
      values[i*3+2]=radius*Math.cos(phi);
    }
    return values;
  },[count]);
  useFrame((state,delta)=>{
    if(points.current){
      points.current.rotation.y+=delta*.018;
      points.current.rotation.x=THREE.MathUtils.damp(points.current.rotation.x,state.pointer.y*.025,.8,delta);
    }
  });
  return <points ref={points}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry>
    <pointsMaterial color="#8ea978" size={mobile ? 0.018 : 0.024} transparent opacity={.68} sizeAttenuation depthWrite={false}/>
  </points>;
}

function Scene({mobile}){
  return <>
    <ambientLight intensity={1.1}/>
    <pointLight position={[3,3,4]} intensity={mobile?12:22} color="#eff8df"/>
    <pointLight position={[-3,-2,2]} intensity={mobile?7:12} color="#9fbd83"/>
    <ParticleField mobile={mobile}/>
    <Orb mobile={mobile}/>
  </>;
}

export default function VeltrixHeroScene(){
  const [ready,setReady]=useState(false);
  const [webgl,setWebgl]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [lite,setLite]=useState(false);
  useEffect(()=>{
    const update=()=>{
      const isMobile=window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
      const cores=navigator.hardwareConcurrency||8;
      const memory=navigator.deviceMemory||8;
      setMobile(isMobile);
      setLite(isMobile||cores<=4||memory<=4);
      setWebgl(hasWebGL()&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      setReady(true);
    };
    update();
    window.addEventListener('resize',update,{passive:true});
    return()=>window.removeEventListener('resize',update);
  },[]);
  return <div className={`vx-hero-scene ${mobile?'is-mobile':'is-desktop'}`} aria-hidden="true">
    {ready&&webgl?<Canvas
      camera={{position:[0,0,6],fov:42}}
      dpr={lite?1:[1,1.5]}
      gl={{alpha:true,antialias:!mobile,powerPreference:'high-performance',stencil:false,depth:true}}
      performance={{min:lite ? 0.45 : 0.65}}
      frameloop="always"
    ><Scene mobile={lite}/></Canvas>:<div className="vx-scene-fallback"><span className="vx-fallback-orb"/><i/><b/></div>}
  </div>;
}
