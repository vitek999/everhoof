<template>
  <!-- begin .player-buttons-->
  <div class="player-buttons">
    <div class="player-buttons__buttons-container">
      <button class="player-buttons__button" disabled>{{ $t('buttons.history') }}</button>
      <button class="player-buttons__button" disabled>{{ $t('buttons.chat') }}</button>
      <button class="player-buttons__button" disabled>{{ $t('buttons.records') }}</button>
    </div>
    <div class="player-buttons__links-container">
      <a v-for="(link, i) in links" :key="i" :href="link.href" class="player-buttons__link" :title="link.title">
        <svg-icon :name="link.icon" />
      </a>
    </div>
    <b-modal v-model="history" :title="$t('modals.tracks_history')">
      <b-history-modal />
    </b-modal>
  </div>
  <!-- end .player-buttons-->
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import BModal from '~/components/modal/modal.vue';
import BHistoryModal from '~/components/history-modal/history-modal.vue';

@Component({
  name: 'b-player-buttons',
  components: { BHistoryModal, BModal },
})
export default class PlayerButtons extends Vue {
  links = [
    { title: 'Discord', icon: 'discord', href: '#' },
    { title: 'VK', icon: 'vk', href: '#' },
    {
      title: 'YouTube',
      icon: 'youtube',
      href: '#',
    },
  ];
  history = false;
}
</script>

<style lang="stylus" src="./player-buttons.styl" />
