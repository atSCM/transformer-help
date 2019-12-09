<script>
  import { name as packageName } from '../package.json';
  import { onMount } from 'svelte';

  export let name;
  export let description;
  export let parameters = [];

  $: groupedParameters = parameters.reduce((groups, param) => {
    const paramGroup = groups.find(({ group }) => group === param.group);

    if (!paramGroup) {
      groups.push({ group: param.group, params: [param] });
    } else {
      paramGroup.params.push(param);
    }

    return groups;
  }, []);

  function info(param) {
    return [
      { key: 'valuetype', title: 'Type' },
      { key: 'defaultvalue', title: 'Default value' },
      { key: 'config', title: 'Possible values' },
      { key: 'substitute', title: 'Substitute' },
    ].reduce(
      (all, { key, title }) => (param[key] ? [...all, { key, title, value: param[key] }] : all),
      []
    );
  }

  function usage(param) {
    let value =
      {
        address: 'AGENT.OBJECTS.MyNode',
        display: 'AGENT.DISPLAYS.Main',
        string: 'A string value',
        trstring: 'T{Translated string}',
        number: '13',
        bool: 'true',
        color: '#ff0000',
        global: 'SYSTEM.GLOBALS.MyGlobal',
      }[param.valuetype] || 'value';

    if (param.valuetype === 'enum') {
      const [first] = (param.config || '').split(';').filter(a => a);

      if (first) value = first;
    }

    return `<atv:argument name="${param.name}" value="${value}" />`;
  }

  $: hasGroups = groupedParameters.length > 1;
</script>

<style>
  .notes {
    margin-top: 1em;
  }
</style>

<section class="hero">
  <div class="hero-body">
    <h1 class="title">{name}</h1>

    {#if description}
      <p class="subtitle">{description}</p>
    {/if}
  </div>
</section>

<!-- <section class="section">
  <div class="container">
    <h2 class="title">Usage</h2>

    <pre>
      <code>
        <svg
          id="id_0"
          width="210"
          atv:refpy="168.175"
          atv:refpx="521.338"
          height="75"
          x="416.338"
          y="130.675"
          xlink:href="SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS.Advanced.bar_horizontal">
          <atv:argument value="SYSTEM.GLOBALS.atvAccent1" name="teststring" />
        </svg>
      </code>
    </pre>
  </div>
</section> -->

<section class="section has-background-light">
  <div class="container">
    <h2 class="title">Parameters</h2>

    <aside class="menu">
      {#each groupedParameters as { group, params }}
        <p class="menu-label">{group || '(global)'}</p>
        <ul class="menu-list">
          {#each params as param}
            <li>
              <details>
                <summary>
                  <strong>
                    {param.name}
                    {#if param.behavior === 'mandatory'}
                      <span class="has-text-danger">*</span>
                    {/if}
                  </strong>
                  <span>{param.desc || 'No description'}</span>
                </summary>
                <div class="content">
                  <table class="table">
                    <tbody>
                      {#each info(param) as { title, value }}
                        <tr>
                          <td>{title}:</td>
                          <td>{value}</td>
                        </tr>
                      {/each}
                      <tr>
                        <td>Usage:</td>
                        <td>
                          <code>{usage(param)}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </li>
          {/each}
        </ul>
      {/each}
    </aside>
    <div class="notes content">
      <p>
        <span class="has-text-danger">*</span>
        Required parameter
      </p>
    </div>
  </div>
</section>

<footer class="footer has-text-centered">
  <!-- FIXME: Insert repo url -->
  Created with
  <code>{packageName}</code>
</footer>
