<template>
    <div v-if="clues" >
    <table class="border-collapse">
      <thead>
      <tr>
        <th class="justify-center w-1/6 border border-gray-300 bg-orange-200 text-rose-500"> Orientation </th>
        <th class="justify-center w-1/6 border border-gray-300 bg-orange-200 text-rose-500"> Column </th>
        <th class="justify-center w-1/6 border border-gray-300 bg-orange-200 text-rose-500"> Row </th>
        <th class="justify-center w-1/2 border border-gray-300 bg-orange-200 text-rose-500"> Clue </th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in clues" @mouseenter="$emit('hoverClue', item.word)" @mouseleave="$emit('leaveClue')" @click="$emit('revealClue', item.word)" 
        :class="[
          'bg-yellow-100 border border-gray-400',
          'hover:bg-orange-200 cursor-pointer',
          isHighlighted(item) ? 'outline outline-2 outline-blue-500' : ''
        ]" 
        >
            <td class="justify-center w-1/6 border border-gray-300"> {{ item.position}} </td>
            <td class="justify-center w-1/6 border border-gray-300 "> {{ item.end + 1}}</td>
            <td class="justify-center w-1/6 border border-gray-300 "> {{ item.start + 1 }} </td>
            <td class="justify-center w-1/2 border border-gray-300"> {{ item.clue }} </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="text-gray-500">No clues available</p>
</template>

<script setup>
const props = defineProps({
  clues: Object,
  highlightedPosition: Object,
  highlightedClueKey: String,
  highlightedCluesWord: Array
});



function isHighlighted(clue)
{
  if(props.highlightedPosition === null) return false;

  const row = clue.start; // row index
  const startCol = clue.end; // starting column
  if(!props.highlightedCluesWord || props.highlightedCluesWord== null){ 
    props.highlightedCluesWord = [];
  }

  if (clue.position === "H") {
    // Horizontal
    if (props.highlightedPosition.row === row &&
        props.highlightedPosition.column >= startCol &&
        props.highlightedPosition.column < startCol + clue.word.length) {
        if(!props.highlightedCluesWord.includes(clue.word)){
          props.highlightedCluesWord.push(clue.word);
        }
        return true;
    }
  } else if (clue.position === "V") {
    // Vertical
    if (props.highlightedPosition.column === startCol &&
        props.highlightedPosition.row >= row &&
        props.highlightedPosition.row < row + clue.word.length) {
        if(!props.highlightedCluesWord.includes(clue.word)){
          props.highlightedCluesWord.push(clue.word);
        }
        return true;
    }
  }

  if(props.highlightedCluesWord != null && props.highlightedCluesWord.includes(clue.word)){
    props.highlightedCluesWord.pop(clue.word);
  }
  return false;
}
</script>