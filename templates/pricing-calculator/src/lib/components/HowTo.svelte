<script lang="ts">
  let { items }: { items: Array<{ question: string; answer: string }> } = $props()
</script>

<section class="how-to" aria-labelledby="how-to-title">
  <div class="how-to__intro">
    <p>FIELD NOTES / 03</p>
    <h2 id="how-to-title">How the meter reads.</h2>
  </div>
  <div class="how-to__items">
    {#each items as item, index (item.question)}
      <details open={index === 0}>
        <summary>
          <span>0{index + 1}</span>
          {item.question}
          <i aria-hidden="true">+</i>
        </summary>
        <p>{item.answer}</p>
      </details>
    {/each}
  </div>
</section>
