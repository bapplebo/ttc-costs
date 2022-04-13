<script lang="ts">
  import { createPopper } from '@popperjs/core';
  import IntersectionObserver from '../IntersectionObserver.svelte';
  import Fa from 'svelte-fa';
  import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
  export let unit;

  let iconRef;
  let popoverRef;
  let showTooltip = false;

  function getUnitName(name, key) {
    if (name === 'Unlocalised Unit') {
      return key;
    }

    return name;
  }

  function getPip(type: string, cost) {
    if (type === 'core') {
      return 'common_units.png';
    }

    if (type === 'special') {
      switch (cost) {
        case '1':
          return 'special_units_1.png';
        case '2':
          return 'special_units_2.png';
        case '3':
          return 'special_units_3.png';
      }
    }

    if (type === 'rare') {
      switch (cost) {
        case '1':
          return 'rare_units_1.png';
        case '2':
          return 'rare_units_2.png';
        case '3':
          return 'rare_units_3.png';
      }
    }
  }

  function toggleTooltip() {
    console.log('check toggle');
    if (showTooltip) {
      showTooltip = false;
    } else {
      showTooltip = true;
    }
  }
</script>

<li id="tooltip" class="unit">
  <div class="image-placeholder">
    <IntersectionObserver let:intersecting top={400}>
      {#if intersecting}
        <img class="unit-card" src={`assets/unit_cards/${unit.card}.webp`} alt="Unit card" />
      {:else}
        <div class="loading-image" />
      {/if}
    </IntersectionObserver>
  </div>

  <div class="unit-key">
    <div>{getUnitName(unit.name, unit.unitKey)}</div>
    {#if unit.additionalNotes}
      <div
        bind:this={iconRef}
        on:mouseenter={toggleTooltip}
        on:mouseleave={toggleTooltip}
        class="tooltip-marker pointer"
      >
        <Fa icon={faCircleQuestion} />
      </div>
      <div bind:this={popoverRef} class={showTooltip ? 'block' : 'hidden'}>
        <div class="tooltip-content">{unit.additionalNotes}</div>
      </div>
    {/if}
  </div>
  <div class="unit-type">{unit.type}</div>
  <div class="unit-cost">
    <span>{unit.cost ?? '-'}</span>
    <img src={`assets/${getPip(unit.type, unit.cost)}`} alt="Cost" />
  </div>
</li>

<style>
  .block {
    display: block;
    position: absolute;
    top: 24px;
  }

  .hidden {
    display: none;
  }

  .pointer {
    cursor: pointer;
  }

  .tooltip-marker {
    margin-left: 10px;
  }

  .tooltip-content {
    max-width: 400px;
    border-radius: 4px;
    font-size: 14px;
    background: #fff;
    padding: 10px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .unit-card {
    margin-right: 12px;
    height: 100%;
  }

  .image-placeholder {
    border-radius: 4px;
    border: 1px solid #111;
    height: 100px;
    width: 46px;
    background: transparent;
    background-size: contain;
    overflow: hidden;
    margin-right: 12px;
  }

  .loading-image {
    height: 100%;
    animation-name: betterLoading;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    background-color: #fff;
    background-repeat: no-repeat;
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, 0.8) 50%, hsla(0, 0%, 100%, 0)),
      linear-gradient(#ddd 100%, transparent 0);
    background-size: 99% 100%, cover;
  }

  .unit {
    display: flex;
    padding: 8px 4px;
    transition: all 0.2s ease-in-out;
    align-items: center;
    border-radius: 4px;
  }

  .unit:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .unit .unit-key {
    flex: 1;
    font-size: 20px;
    display: flex;
    align-items: center;
    width: 12px;
    height: 12px;
    position: relative;
  }

  .unit .unit-type {
    margin: 0 20px;
    font-variant: small-caps;
  }

  .unit .unit-cost {
    display: flex;
    align-items: center;
  }

  .unit-cost img {
    margin-left: 10px;
  }
</style>
