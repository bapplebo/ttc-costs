<script lang="ts">
  import { fetchLua } from './fetch';
  import { parseFile } from './parser';
  import Spinner from './Spinner.svelte';
  import Unit from './components/Unit.svelte';
  import './app.css';

  let filter: string = '';
  let data: any[] = [];
  let originalData = [];
  let dataHasLoaded = false;
  async function getData() {
    const rawFile = await fetchLua();
    const parsedFile = parseFile(rawFile);
    return parsedFile;
  }

  getData().then((d) => {
    data = d;
    originalData = d;
    dataHasLoaded = true;
  });

  function filterHandler(e) {
    const filterText = e.target.value;

    if (filterText.trim() !== '') {
      const newData = [];

      data.forEach((faction) => {
        faction.units.forEach((unit) => {
          if (unit.name.toLowerCase().includes(filterText.toLowerCase())) {
            // todo - do this in one loop some day
            if (!newData.some((list) => list.faction === unit.faction)) {
              newData.push({ faction: unit.faction, units: [] });
            }

            const toMutate = newData.find((list) => list.faction === unit.faction);
            toMutate.units.push(unit);
          }
        });
      });
      data = newData;
    } else {
      data = originalData;
    }
  }
</script>

<main>
  <div class="header">Tabletop Caps - Costs</div>

  <div class="content">
    {#if !dataHasLoaded}
      <Spinner />
    {:else}
      <div class="sidebar">
        <input on:keyup={filterHandler} placeholder="Filter by unit name..." />
        {#each data as faction}
          <div class="sidebar-faction-name"><a href="#{faction.faction}">{faction.faction}</a></div>
        {/each}
      </div>
      <div class="faction-content">
        {#each data as faction}
          <div class="faction">
            <div id={faction.faction} class="faction-name">{faction.faction}</div>
            {#each faction.units as unit}
              <Unit {unit} />
            {/each}
          </div>
        {/each}
        {#if !data || data.length === 0}
          <div>No units found for this filter query.</div>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    max-width: 260px;
    margin: 0 auto;
  }

  .header {
    margin: 24px 0;
    font-size: 30px;
    text-transform: uppercase;
    color: #ff3e00;
    font-weight: 100;
  }

  .content {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }

  @keyframes betterLoading {
    0% {
      /* This is the position of image of the first frame */
      background-position: -5000% 0, 0 0;
    }
    50% {
      /* This is the pos of img of a frame in the middle happening animation */
      /* If duration is 1s then the pos below will be at 0.5s */
      background-position: 5000% 0, 0 0;
    }
    100% {
      /* This is the pos of img of the last frame */
      background-position: -5000% 0, 0 0;
    }
  }

  .sidebar {
    position: sticky;
    align-self: flex-start; /* https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox */
    top: 10px;
    min-width: 200px;
  }

  .sidebar input {
    width: 180px;
  }

  .sidebar-faction-name {
  }

  .faction-content {
    flex: 1;
  }

  .faction {
    margin-bottom: 20px;
  }

  .faction-name {
    font-variant: small-caps;
    font-size: 24px;
    margin-bottom: 6px;
  }

  @media (min-width: 640px) {
    main {
      max-width: 900px;
    }
  }
</style>
