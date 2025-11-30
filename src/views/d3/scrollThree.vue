<template>
  <div class="content">
    <div class="pipeline">
      <div class="pipeline-inner"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pipeline {
  position: relative;
  width: 300px;
  height: 30px;
  padding: 5px;
  margin: 20px;
  background: #2c3e50;
  border-radius: 15px;
  box-shadow: inset 0 2px 4px rgb(0 0 0 / 30%);
}

.pipeline-inner {
  position: relative;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 15px,
    #3498db 15px,
    #3498db 20px,
    transparent 20px,
    transparent 25px,
    #3498db 25px,
    #3498db 30px
  );
  background-size: 30px 100%;
  border-radius: 10px;
  box-shadow: 0 0 8px rgb(52 152 219 / 60%);
  opacity: 0.8;
  animation: flow 1s linear infinite;

  &::before {
    position: absolute;
    inset: 0;
    clip-path: polygon(0 25%, 100% 50%, 0 75%);
    content: '';
    background: repeating-linear-gradient(90deg, transp transparent 15 #3498db 15px, #3498db 20px);
    background-size: 30px 100%;
    animation: flow 1s linear infinite;
  }
}

@keyframes flow {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 30px 0;
  }
}
</style>
